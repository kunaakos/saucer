import { PageDataLoader } from '../../saucer/components/PageContext'
import { logger } from '../../saucer/logger'
import { HomePageData } from './home'

export const homePageLoader: PageDataLoader<HomePageData> = async () => {
    const data: HomePageData = { message: 'hi!' }
    logger.trace('Fetching "home" page data.')
    return data
}
