import React from 'react'
import { Navigation } from './Navigation'

import styles from 'styles/styles.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <Navigation collapsed={true} className={styles.sidebar}/>
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  )
}
