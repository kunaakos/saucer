import dayjs from 'dayjs'
import React from 'react'

import { Button } from '../uikit/Button'
import { Card } from '../uikit/Card'
import { Input } from '../uikit/Input'
import { InputLabel } from '../uikit/InputLabel'
import styles from './EventFilter.css'
import { useDateInputState } from './useDateInputState'
import { useSearchInputState } from './useSearchInputState'
import { DateInputValue, dateInputValToEpoch } from './utils'

const TODAY = dayjs().format('YYYY-MM-DD') as DateInputValue
const ONE_MONTH_FROM_NOW = dayjs().add(1, 'month').format('YYYY-MM-DD') as DateInputValue

export type EventFilterValues = { startDate: EpochTimeStamp; endDate: EpochTimeStamp; fragment: string | null }

type EventFilterProps = {
    onSubmit: (values: EventFilterValues) => void
}

export const EventFilter = ({ onSubmit }: EventFilterProps) => {
    const { props: startDateInputProps, value: startDate } = useDateInputState({
        initialValue: TODAY,
        required: true,
        min: TODAY,
        max: ONE_MONTH_FROM_NOW,
    })
    const { props: endDateInputProps, value: endDate } = useDateInputState({
        initialValue: ONE_MONTH_FROM_NOW,
        required: true,
        min: TODAY,
        max: ONE_MONTH_FROM_NOW,
    })
    const { props: searchProps, value: fragment } = useSearchInputState()

    const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        // one could disable the button as an alternative, but this approach explains *why* the action is unavailable
        if (!startDate || !endDate) {
            alert('Please provide a valid date range.')
        } else {
            e.currentTarget.blur()
            onSubmit({
                startDate: dateInputValToEpoch(startDate),
                endDate: dateInputValToEpoch(endDate) + 1000 * 60 * 60 * 24, // NOTE: quick and dirty: include events from end date day
                fragment,
            })
        }
    }

    return (
        <Card className={styles.container}>
            <div className={styles.row}>
                <Input {...searchProps} className={styles.searchInputField} />
            </div>
            <div className={styles.row}>
                <div className={styles.group}>
                    <InputLabel htmlFor="start-date">from</InputLabel>
                    <Input id="start-date" {...startDateInputProps} />
                </div>
                <div className={styles.group}>
                    <InputLabel htmlFor="end-date">to</InputLabel>
                    <Input id="end-date" {...endDateInputProps} />
                </div>
            </div>
            <div className={styles.row}>
                <Button className="primary" onClick={onClick}>
                    Search
                </Button>
            </div>
        </Card>
    )
}
