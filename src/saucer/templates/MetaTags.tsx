import React from 'react'

export type PageMeta = {
    title: string
}

type MetaTagsProps = {
    pageMeta: PageMeta
}

export const MetaTags = ({ pageMeta }: MetaTagsProps) => (
    <>
        <title>{pageMeta.title}</title>
    </>
)
