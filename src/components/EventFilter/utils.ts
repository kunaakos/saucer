import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)

export type DateInputValue = `${number}-${number}-${number}`

export const dateInputValToEpoch = (value: DateInputValue): EpochTimeStamp => {
    return dayjs(value, 'YYYY-MM-DD', true).valueOf()
}

export const displayDate = (stamp: EpochTimeStamp): string => dayjs(stamp).format(`MMMM D, YYYY`)

export const displayHours = (stamp: EpochTimeStamp): string => dayjs(stamp).format(`H:mm`)
