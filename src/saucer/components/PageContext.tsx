import React, { useCallback, useContext } from 'react'
import { createContext, useState } from 'react'

export type PageDataLoader<PageDataType> = () => Promise<PageDataType>

type PageComponentProps<PageDataType> = {
    pageData: PageDataType
}

export type PageComponent<PageDataType> = (props: PageComponentProps<PageDataType>) => React.ReactNode

type LayoutComponentProps = {
    children: React.ReactNode
}

export type LayoutComponent = (props: LayoutComponentProps) => React.ReactNode

export type PageDefinition<PageDataType> = {
    path: string
    loader: PageDataLoader<PageDataType>
    component: PageComponent<PageDataType>
    layout: LayoutComponent
}

export type PageDefinitions = PageDefinition<any>[]

type PageId = string

type PageDataStatus = 'loading' | 'ok' | 'error'

export type PageContextValue = {
    pageData: Record<PageId, unknown>
    pageDataStatus: Record<PageId, PageDataStatus>
    pageStatus: (pageId: PageId) => PageDataStatus | null
    loadPageData: (pageId: PageId) => void
}

const generateOkStatusFor = (initialPageData: Record<string, unknown>) => {
    return Object.keys(initialPageData).reduce(
        (acc, val) => {
            acc[val] = 'ok'
            return acc
        },
        {} as Record<PageId, PageDataStatus>,
    )
}

const PageContext = createContext<PageContextValue>({
    pageData: {},
    pageDataStatus: {},
    pageStatus: () => 'error',
    loadPageData: () => {},
})

type PageDataProviderProps = Pick<PageContextValue, 'pageData'> & {
    children: React.ReactNode
    pageDataLoaders: Record<PageId, () => void>
}

/**
 * NOTE: This module is a bit of a mess.
 * It has gone through several different approaches,
 * so a bit of renaming and refactoring is due.
 */

export const PageContextProvider = ({ pageData: initialPageData, children }: PageDataProviderProps) => {
    const [pageData, _setPageData] = useState(initialPageData)
    const [pageDataStatus, _setPageDataStatus] = useState<Record<PageId, PageDataStatus>>(
        generateOkStatusFor(initialPageData),
    )
    const setPageData = useCallback(
        (pageId: PageId, newPageData: unknown) => {
            _setPageData({ ...pageData, [pageId]: newPageData })
        },
        [pageData],
    )
    const setPageDataStatus = useCallback(
        (pageId: PageId, newPageDataStatus: PageDataStatus) => {
            _setPageDataStatus({ ...pageDataStatus, [pageId]: newPageDataStatus })
        },
        [pageDataStatus],
    )
    const pageStatus = (pageId: PageId) => pageDataStatus[pageId] || null

    // TODO: the fetch is not isomorphic, and it's not even needed on the server, refactor!
    const fetchPageData = async (pageId: PageId) => {
        try {
            const response = await fetch(`/api/pd${pageId}`)
            if (!response.ok) throw new Error(`API response status: ${response.status}`)
            const responseData = await response.json()
            if (responseData.pageData[pageId]) {
                setPageData(pageId, responseData.pageData[pageId])
            } else {
                throw new Error(`Malformed API response.`)
            }
        } catch (error) {
            console.error(error)
            setPageDataStatus(pageId, 'error')
        }
    }

    const loadPageData = async (pageId: PageId) => {
        setPageDataStatus(pageId, 'loading')
        fetchPageData(pageId)
    }

    return (
        <PageContext.Provider value={{ pageData, pageStatus, pageDataStatus, loadPageData }}>
            {children}
        </PageContext.Provider>
    )
}

export const usePageContext = (pageId: PageId) => {
    const pageContext = useContext(PageContext)
    return {
        pageData: pageContext.pageData[pageId] || null,
        pageDataStatus: pageContext.pageData[pageId] || null,
        loadPageData: () => pageContext.loadPageData(pageId),
    }
}
