import React from 'react'

import styles from './Button.css'
import sharedStyles from './shared-styles.css'

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    children: React.ReactNode
    className?: string
}

export const Button = ({ children, className, ...rest }: ButtonProps) => (
    <button className={`${sharedStyles.input} ${styles.button} ${className || ''}`} {...rest}>
        {children}
    </button>
)
