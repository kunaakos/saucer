import { Express } from 'express'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { Router, SsrContext } from 'wouter'

import { PageContextProvider, PageDefinitions } from '../components/PageContext'
import { Routes } from '../components/Routes'
import { logger } from '../logger'
import { HtmlDocument } from '../templates/HtmlDocument'
import { HeaderLinkTagProps } from '../templates/LinkTags'
import { PageMeta } from '../templates/MetaTags'
import { HeaderScriptTagProps } from '../templates/ScriptTags'
import { getHashedName } from '../util/server/clientBundleManifest'
import { loadPageData } from '../util/server/loadPageData'

type initPageRendererArgs = {
    app: Express
    pages: PageDefinitions
}

export const initPageRenderer = ({ app, pages }: initPageRendererArgs) => {
    const cssBundle = getHashedName('main.css')
    const jsBundle = getHashedName('main.js')

    const pageMeta: PageMeta = {
        title: 'Saucer',
    }

    const linkTags: HeaderLinkTagProps[] = [
        // TODO: not sure preload is the best option for styles, check later
        { rel: 'preload', href: cssBundle, as: 'style' },
        // NOTE: `crossOrigin` is mandatory, see https://stackoverflow.com/questions/70183153/why-do-we-need-the-crossorigin-attribute-when-preloading-font-files
        { rel: 'preload', href: `/assets/font/OpenRunde-Regular.woff`, as: 'font', crossOrigin: '' },
        { rel: 'stylesheet', href: cssBundle },
    ]

    const scriptTags: HeaderScriptTagProps[] = [{ src: jsBundle, defer: true }]

    /**
     * The way this *SHOULD* work:
     * This middleware is a catch-all handler for HTML GET requests.
     * 1. It checks if there's a `PageDefinition` declared with a matching path.
     * 2. If it finds one it fetches its `PageData`.
     * 3. It adds the data to the `PageContext`
     * 4. Renders a page server-side with the fetched data.
     */
    app.get(/^[^\.]*$/, async (req, res) => {
        logger.trace(`render page: ${req.url}`)
        const ssrContext: SsrContext = {}

        const { pageId, pageData } = await loadPageData({ path: req.url, pages })

        /**
         * NOTE: `renderToPipeableStream` turned out to be more pain than it's worth,
         * and `preact` doesn't do it anyways, so I'll get rid of it soon.
         *
         * Instead, the page will be rendered in chunks, and those chunks streamed:
         * 1. The `<head>` with relevant metadata is sent ASAP, to allow the client to load/preload assets.
         * 2. The `<body>` is rendered and sent when ready, with the fetched `PageData` added to the `PageContextValue`.
         * 3. Additional `PageData` can be fetched in parallel with rendering and added to the `PageContextValue` as well.
         *
         * The client script will hydrate only when the complete document is finished streaming.
         * This way, one has three options for data fetching to be used throughout the page:
         * A. fetch before render (for critical, quickly available data)
         * B. fetch in parallel with render (easily available data prefetched for heavier, lazy-loaded components)
         * C. fetch on client (data that is slow to fetch, where an additional request is preferred to delaying page rendering)
         */
        const { pipe, abort } = renderToPipeableStream(
            <HtmlDocument
                pageMeta={pageMeta}
                scriptTags={scriptTags}
                linkTags={linkTags}
                pageContext={{ pageData: { [pageId]: pageData[pageId] } }}
            >
                <PageContextProvider pageData={pageData} pageDataLoaders={{}}>
                    <Router ssrPath={req.path} ssrSearch={''} ssrContext={ssrContext}>
                        <Routes pages={pages} />
                    </Router>
                </PageContextProvider>
            </HtmlDocument>,
            {
                onShellReady() {
                    /**
                     * `wouter` sets a `redirectTo` value if it's route config determined
                     * that a redirect is needed, and in which case a proper 302
                     * response should be sent.
                     */
                    if (ssrContext.redirectTo) {
                        abort()
                        res.redirect(ssrContext.redirectTo)
                        logger.trace(`redirected to: ${ssrContext.redirectTo}`)
                    } else {
                        res.statusCode = 200
                        res.setHeader('Content-type', 'text/html')
                        pipe(res)
                    }
                },
                onShellError() {
                    res.statusCode = 500
                    res.send('<!doctype html><p>womp womp :(</p>')
                },
            },
        )
    })
}
