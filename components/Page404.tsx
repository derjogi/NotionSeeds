import * as React from 'react'
import * as types from 'lib/types'
import { PageHead } from './PageHead'
import BodyClassName from 'react-body-classname'

import styles from './styles.module.css'
import { useDarkMode } from 'lib/use-dark-mode'
import {useSearchParam} from "react-use";

export const Page404: React.FC<types.PageProps> = ({ site, pageId, error }) => {
  const title = site?.name || 'Notion Page Not Found'

  const lite = useSearchParam('lite')
  const isLiteMode = lite === 'true'

  const { isDarkMode } = useDarkMode()


  return (
    <>
      <PageHead site={site} title={title} />

      {isLiteMode && <BodyClassName className='notion-lite' />}
      {isDarkMode && <BodyClassName className='dark-mode' />}

      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Notion Page Not Found</h1>

          {error ? (
            <p>{error.message}</p>
          ) : (
            pageId && (
              <p>
                Make sure that Notion page &quot;{pageId}&quot; is publicly
                accessible.
              </p>
            )
          )}

          <img
            src='/404.png'
            alt='404 Not Found'
            className={styles.errorImage}
          />
        </main>
      </div>
    </>
  )
}
