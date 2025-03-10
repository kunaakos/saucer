import React from 'react'

import { Event } from '../../pages/events/events.loader'
import { displayHours } from '../EventFilter/utils'
import { Card } from '../uikit/Card'
import styles from './EventCard.css'

//NOTE  quick and dirty currency formatter
const englishHufFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'HUF',
    currencyDisplay: 'narrowSymbol',
})

type EventCardProps = {
    event: Event
}

export const EventCard = ({ event }: EventCardProps) => {
    return (
        <Card className={styles.container}>
            <div className={styles.time}>{displayHours(event.date)}</div>
            <div className={styles.nameAndTags}>
                <div className={styles.name}>{event.name}</div>
                <div className={styles.tags}>
                    {event.isSoldOut && <span className={styles.soldOutTag}>SOLD OUT</span>}
                    {event.isCanceled && <span className={styles.canceledTag}>CANCELED</span>}
                </div>
            </div>
            <div className={styles.description}>{event.description}</div>
            <div className={styles.price}>{englishHufFormatter.format(event.price)}</div>
            {/* TODO: should be a component... */}
            <div className={styles.contextMenu}></div>
        </Card>
    )
}
