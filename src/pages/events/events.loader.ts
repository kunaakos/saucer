import { fakeEvents } from './fakeEvent'

export type Event = {
    id: string
    name: string
    description: string
    date: EpochTimeStamp
    isCanceled: boolean
    isSoldOut: boolean
    price: number
}

let events: Event[] = []

export type EventsPageData = {
    events: Event[]
}

export const eventsPageLoader = async () => {
    // NOTE: the `fakeEvents` call needs to stay within the scope of the loader function
    // this ensures that loader deps are tree shaked, and only included in the server bundle
    if (!events.length) {
        events = fakeEvents(50)
    }
    const data: EventsPageData = { events }
    return data
}
