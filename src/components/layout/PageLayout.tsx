import React from 'react'

import { Nav } from './Nav'

type PageLayoutProps = {
    children: React.ReactNode
}

export const PageLayout = ({ children }: PageLayoutProps) => {
    return (
        <>
            <Nav />
            {children}
        </>
    )
}
