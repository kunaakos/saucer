import React, { useEffect } from 'react'
import { useLocation } from 'wouter'

import { PageDefinition, usePageContext } from './PageContext'

type PageProps<PageDataType> = Pick<PageDefinition<PageDataType>, 'path' | 'component' | 'layout'>

const pathWithoutParamsRegex = /^\/[^?]*/

const getPathWithoutParams = (location: string) => {
    const matches = location.match(pathWithoutParamsRegex)
    if (matches && typeof matches[0] === 'string') {
        return matches[0]
    } else {
        throw new Error('Invalid path.')
    }
}

/**
 * This component is similar to `Suspense`, but it doesn't rely on async or lazy loaded components.
 * It's just a simple component that relies on `PageContext` for data, and it will either:
 * A. Render the `PageComponent` if data is available (typically during SSR)
 * B. Attempt to fetch data and display a loading screen (typically during CSR navigation)
 */

export const Page = function <PageDataType>({
    // NOTE: anything with a valid `path` param will behave
    // as a `wouter` `Route` when passed as a child to `Switch`
    path: _path,
    component: PageComponent,
    layout: LayoutComponent,
}: PageProps<PageDataType>) {
    const [location] = useLocation()
    const pageId = getPathWithoutParams(location)
    const { pageData, pageDataStatus, loadPageData } = usePageContext(pageId)

    useEffect(() => {
        if (pageDataStatus === null) {
            console.log('loading')
            loadPageData()
        }
    }, [pageData, pageDataStatus])

    if (pageData) {
        return (
            <LayoutComponent>
                <PageComponent pageData={pageData as PageDataType} />
            </LayoutComponent>
        )
    } else if (pageDataStatus === null || pageDataStatus === 'loading') {
        return (
            <LayoutComponent>
                <p>loading...</p>
            </LayoutComponent>
        )
    } else {
        return (
            <LayoutComponent>
                <p>Something went wrong :(</p>
            </LayoutComponent>
        )
    }
}
