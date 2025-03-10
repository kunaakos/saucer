import compression from 'compression'
import express from 'express'

import { logger } from '../saucer/logger'
import { initApi } from '../saucer/middleware/api'
import { initPageRenderer } from '../saucer/middleware/pageRenderer'
import { initStatic } from '../saucer/middleware/static'
import { pages } from './pages'

const app = express()

app.use(compression())

/**
 * NOTE: this is a refactor-in-progress, the goal is to have something like
 * `app.use(saucer({pages, ...}))`
 *
 * TODO: this module should itself run through the Saucer bundler,
 * which is a bit of a pulling yourself up by the bootstraps situation.
 * I'm leaning towards having this single entry point to an app (app.ts),
 * which will be started/built/served through a cli, like:
 * `npx saucer dev app.ts`
 * `npx saucer build app.ts`
 * `npx saucer serve`
 *
 * The client bundle should be generated automatically, with webpack handling
 * all the style extraction, splitting, replacements etc.
 *
 * For now, logic was moved to separate modules for easier handling,
 * and everything is orchestrated with npm scripts still.
 */
initStatic({ app })
initApi({ app, pages })
initPageRenderer({ app, pages })

app.listen(3000, () => {
    logger.info('Server is running on port: 3000')
})
