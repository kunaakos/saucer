import React from 'react'

import { PageComponent } from '../../saucer/components/PageContext'

export type HomePageData = {
    message: string
}

export const HomePage: PageComponent<HomePageData> = ({ pageData }) => {
    return (
        <>
            <p>Home page.</p>
            <p>{pageData.message}</p>
        </>
    )
}
