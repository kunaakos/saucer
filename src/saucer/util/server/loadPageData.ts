import { PageDefinitions } from '../../components/PageContext'
import { getPathWithoutParams } from '../shared/location'

type FetchPageDataParams = {
    pages: PageDefinitions
    path: string
}

type FetchPageDataReturnType = {
    pageData: Record<string, unknown>
    pageId: string
}

/**
 * NOTE: VERY HACKY and does not support url params
 * `wouter`'s `matchRoute` should be used to find a `PageDefinition`
 * with the *pattern* that matches the current route,
 * but the pattern itself is used for now.
 * This will work for paths without *path params*,
 * and *url params* are ignored when it comes to page data anyways.
 */
export const loadPageData = async ({
    pages,
    path, // NOTE: this could preload data for several pages at once
}: FetchPageDataParams): Promise<FetchPageDataReturnType> => {
    const pageId = getPathWithoutParams(path)
    const pageDefinition = pages.find((page) => page.path === pageId)
    if (!pageDefinition) throw new Error('PageDefinition not found')
    return {
        pageData: {
            [pageId]: await pageDefinition.loader(),
        },
        pageId,
    }
}
