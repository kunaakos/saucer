import React from 'react'

import styles from './Card.css'

type CardProps = {
    children: React.ReactNode
    className?: string
}

export const Card = ({ children, className }: CardProps) => (
    <div className={`${className || ''} ${styles.card}`}>{children}</div>
)
