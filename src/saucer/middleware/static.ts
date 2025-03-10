import express, { Express } from 'express'
import path from 'path'
import serveFavicon from 'serve-favicon'
import type serveStatic from 'serve-static'

import { logger } from '../logger'

type initStaticServerArgs = {
    app: Express
}

export const initStatic = ({ app }: initStaticServerArgs) => {
    const expressStaticOptions: serveStatic.ServeStaticOptions = {
        maxAge: 60000, // TODO: set values for prod and dev
        dotfiles: 'ignore',
        fallthrough: false,
        // TODO: disable for prod
        setHeaders: (_, file_path, __) => {
            logger.trace(`serve static: ${file_path}`)
        },
    }

    app.use('/static', express.static(path.resolve(__dirname, '../../../build/client'), expressStaticOptions))
    app.use('/assets', express.static(path.resolve(__dirname, '../../../assets'), expressStaticOptions))

    app.use(serveFavicon(path.join(__dirname, '../../../assets/ico/favicon.ico')))
}
