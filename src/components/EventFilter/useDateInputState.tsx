import { useState } from 'react'

import { InputProps } from '../uikit/Input'
import { DateInputValue } from './utils'

type UseDateInputParams = {
    initialValue: DateInputValue
    min: DateInputValue
    max: DateInputValue
    required: boolean
}

type UseDateInputReturns = {
    value: DateInputValue | null
    props: InputProps
}

export const useDateInputState = ({ initialValue, required, min, max }: UseDateInputParams): UseDateInputReturns => {
    const [value, setValue] = useState(initialValue)
    const [isValid, setIsValid] = useState(true)

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        /**
         * This relies on the browser for validation.
         * The cast is safe in this case (with a date input).
         * The worst that can happen is an out-of-range date.
         */
        setIsValid(e.target.checkValidity())
        setValue(e.target.value as DateInputValue)
    }

    return {
        /**
         * The `value` is either a fully valid date, or null.
         * This works both for required and optional inputs.
         */

        value: isValid
            ? value || null // return `null` instead of empty strings...
            : null, //... or invalid values.
        props: {
            type: 'date',
            autoComplete: 'off',
            value,
            onChange,
            /**
             * NOTE: the `:invalid` CSS selector should be used to signal
             * invalid input state, which should be added correctly as long as
             * thse properties are defined.
             */
            required,
            min,
            max,
        },
    }
}
