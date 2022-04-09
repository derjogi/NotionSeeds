import React from 'react'
import { Navigation } from './Navigation'

import styles from './styles.module.css'

export default function Layout({ children }) {
  return (
    <div className='main'>
      <Navigation collapsed={true}/>
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  )
}
