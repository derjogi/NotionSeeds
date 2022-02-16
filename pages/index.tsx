import React from 'react'
import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'
import { getAllPages } from 'lib/get-all-pages'
import * as config from 'lib/config'

export const getStaticProps = async () => {
  try {
    const notionPageStuff = await resolveNotionPage(domain)
    const links = await getAllPages(
      config.rootNotionPageId,
      config.rootNotionSpaceId
    )

    return {
      props: {
        notionPageStuff,
        links
      },
      revalidate: 10
    }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionDomainPage(props) {
  return <NotionPage {...props} />
}
