import React from 'react'

export type HeaderLinkTagProps = React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>

type LinkTagProps = {
    linkTags: HeaderLinkTagProps[]
}

export const LinkTags = ({ linkTags }: LinkTagProps) => (
    <>
        {linkTags.map((linkTagProps) => (
            <link key={JSON.stringify(linkTagProps)} {...linkTagProps} />
        ))}
    </>
)
