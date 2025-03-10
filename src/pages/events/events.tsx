import React, { useState } from 'react'

import { EventFilter, EventFilterValues } from '../../components/EventFilter/EventFilter'
import { EventList } from '../../components/EventList/EventList'
import { PageComponent } from '../../saucer/components/PageContext'
import { EventsPageData } from './events.loader'

export const EventsPage: PageComponent<EventsPageData> = ({ pageData: { events } }) => {
    const [displayedEvents, setDisplayedEvents] = useState(events)

    /**
     * quick & dirty filtering
     */
    const filterEvents = (filters: EventFilterValues) => {
        setDisplayedEvents(
            events.filter((event) => {
                const startDateOk = filters.startDate ? event.date >= filters.startDate : true
                const endDateOk = filters.endDate ? event.date <= filters.endDate : true
                const containsFragment = filters.fragment
                    ? event.name.toLowerCase().includes(filters.fragment.toLowerCase().trim())
                    : true
                return startDateOk && endDateOk && containsFragment
            }),
        )
    }
    return (
        <>
            <EventFilter onSubmit={filterEvents} />
            <EventList events={displayedEvents} />
        </>
    )
}
