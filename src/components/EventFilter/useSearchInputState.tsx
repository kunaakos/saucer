import { useState } from 'react'

import { InputProps } from '../uikit/Input'

type UseSearchInputReturns = {
    value: string | null
    props: InputProps
}

export const useSearchInputState = (): UseSearchInputReturns => {
    const [value, setValue] = useState<string>('')

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value)
    }

    return {
        value: value || null,
        props: {
            type: 'search',
            placeholder: 'search',
            autoComplete: 'off',
            value: value || '',
            onChange,
        },
    }
}
