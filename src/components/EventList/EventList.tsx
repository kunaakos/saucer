import React from 'react'

import { Event } from '../../pages/events/events.loader'
import { EventCard } from '../EventCard/EventCard'
import { displayDate } from '../EventFilter/utils'
import styles from './EventList.css'

const notOnSameDays = (a: Event, b: Event) => new Date(a.date).getDay() !== new Date(b.date).getDay()

type EventListProps = {
    events: Event[]
}

export const EventList = ({ events }: EventListProps) => {
    return events.map((event, i) => {
        const previousEvent = events[i - 1]
        const renderDateLabel = !previousEvent || notOnSameDays(previousEvent, event)
        return (
            <React.Fragment key={event.id}>
                {renderDateLabel && <div className={styles.dayLabel}>{displayDate(event.date)}</div>}
                <EventCard event={event} />
            </React.Fragment>
        )
    })
}
