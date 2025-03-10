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

//NOTE: gets faked once module load
let events: Event[] = []

export type EventsPageData = {
    events: Event[]
}

export const eventsPageLoader = async () => {
    if (!events.length) {
        events = fakeEvents(50)
    }
    const data: EventsPageData = { events }
    return data
}
