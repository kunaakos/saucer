import { PageLayout } from '../components/layout/PageLayout'
import { EventsPage } from '../pages/events/events'
import { eventsPageLoader } from '../pages/events/events.loader'
import { HomePage } from '../pages/home/home'
import { homePageLoader } from '../pages/home/home.loader'
import { PageDefinition } from '../saucer/components/PageContext'

export const pages: PageDefinition<any>[] = [
    {
        path: '/',
        loader: homePageLoader,
        component: HomePage,
        layout: PageLayout,
    },
    {
        path: '/events',
        loader: eventsPageLoader,
        component: EventsPage,
        layout: PageLayout,
    },
]
