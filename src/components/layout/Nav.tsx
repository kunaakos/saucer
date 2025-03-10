import React from 'react'
import { Link } from 'wouter'

import styles from './Nav.css'

const linkClass = (isActive: boolean) => (isActive ? `active ${styles.link}` : `${styles.link}`)

export const Nav = () => {
    return (
        <nav className={styles.container}>
            <Link to="/" className={linkClass}>
                home
            </Link>
            <Link to="/events" className={linkClass}>
                events
            </Link>
        </nav>
    )
}
