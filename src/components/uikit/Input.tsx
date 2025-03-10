import React from 'react'

import styles from './Input.css'
import sharedStyles from './shared-styles.css'

export type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    className?: string
}

export const Input = ({ children, className, ...rest }: InputProps) => (
    <input className={`${sharedStyles.input} ${styles.input} ${className || ''}`} {...rest}>
        {children}
    </input>
)
