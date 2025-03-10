import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Router } from 'wouter'

import '../app.global.css'
import { PageContextProvider, PageContextValue } from '../saucer/components/PageContext'
import { Routes } from '../saucer/components/Routes'
import { pages } from '../server/pages'

const rootElement = document.getElementById('root')

const pageContextTag = document.getElementById('page-context')
if (!pageContextTag || !rootElement) throw new Error('Cannot hydrate: document incomplete.')
const pageContextJSON = pageContextTag.textContent
if (!pageContextJSON) throw new Error('Cannot hydrate: PageContext missing.')

const pageContext = JSON.parse(pageContextJSON) as PageContextValue

hydrateRoot(
    rootElement,
    <React.StrictMode>
        <PageContextProvider pageData={pageContext.pageData} pageDataLoaders={{}}>
            <Router>
                <Routes pages={pages} />
            </Router>
        </PageContextProvider>
    </React.StrictMode>,
)
