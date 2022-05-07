import React from 'react'
import { Navigation } from './Navigation'

import styles from 'styles/styles.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <Navigation collapsed={false} className={styles.sidebar}/>
      <div className={styles.breakrow}></div> {/*Small screens only: flex-direction is column, but I want to force a break here (and then move the content up to be in line with the sidebar menu button).*/}
      <div className={styles.mainContent}>
        {children} {/*The main notion page with it's own headers, content & footer*/}
      </div>
    </div>
  )
}
