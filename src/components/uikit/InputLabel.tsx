import React from 'react'

import styles from './InputLabel.css'

type InputLabelProps = React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>

export const InputLabel = ({ children, className, ...rest }: InputLabelProps) => (
    <label className={`${styles.label} ${className || ''}`} {...rest}>
        {children}
    </label>
)
