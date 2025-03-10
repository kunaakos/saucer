import { Express } from 'express'

import { PageDefinitions } from '../components/PageContext'
import { logger } from '../logger'
import { loadPageData } from '../util/server/loadPageData'

type initApiArgs = {
    app: Express
    pages: PageDefinitions
}

export const initApi = ({ app, pages }: initApiArgs) => {
    /**
     * NOTE: Quick and dirty regex matcher to provide the following feature:
     * any page url prepended with '/api/pd' should that page's `PageData` only
     * in JSON.
     */
    app.get(/^(?:\/api\/pd)[^\.]*$/, async (req, res) => {
        try {
            const path = req.url.slice(7)
            logger.trace(`fetch page data: ${path}`)
            const { pageData } = await loadPageData({ path, pages })
            res.json({ pageData })
        } catch (error) {
            // NOTE: 500 everything, but this should do proper 404s and such
            res.status(500)
            res.json({ error: 'Internal Error' })
        }
    })
}
