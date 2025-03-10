import React from 'react'

import { PageContextValue } from '../components/PageContext'
import { FaviconTags } from './FaviconTags'
import { HeaderLinkTagProps, LinkTags } from './LinkTags'
import { MetaTags, PageMeta } from './MetaTags'
import { HeaderScriptTagProps, ScriptTags } from './ScriptTags'

type HtmlDocumentProps = {
    pageMeta: PageMeta
    linkTags: HeaderLinkTagProps[]
    scriptTags: HeaderScriptTagProps[]
    pageContext: Pick<PageContextValue, 'pageData'>
    children: React.ReactElement
}

export const HtmlDocument = ({ pageMeta, linkTags, scriptTags, pageContext, children }: HtmlDocumentProps) => {
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <MetaTags pageMeta={pageMeta} />
                <LinkTags linkTags={linkTags} />
                <ScriptTags scriptTags={scriptTags} />
                <FaviconTags />
            </head>
            <body>
                <div id="root">{children}</div>
                <script id="page-context" type="application/json">
                    {JSON.stringify(pageContext)}
                </script>
            </body>
        </html>
    )
}
