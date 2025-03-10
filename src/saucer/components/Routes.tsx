import React from 'react'
import { Redirect, Route, Switch } from 'wouter'

import { Page } from './Page'
import { PageDefinition } from './PageContext'

type RoutesProps = {
    pages: PageDefinition<any>[]
}

export const Routes = ({ pages }: RoutesProps) => {
    return (
        <Switch>
            {pages.map((page) => (
                <Page key={page.path} path={page.path} component={page.component} layout={page.layout} />
            ))}
            <Route>
                {/* NOTE: on the server side, this should trigger a 302 redirect */}
                <Redirect to="/" />
            </Route>
        </Switch>
    )
}
