import React from 'react'
import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'
import { getBlocksForSubPages } from '../lib/notion'
import { parsePageId } from 'notion-utils'

// noinspection JSUnusedGlobalSymbols
export const getStaticProps = async () => {
  try {
    const mainNotionPage = await resolveNotionPage(domain)
    const blocks = await getBlocksForSubPages(
      parsePageId('5507b637e0a349a4b722041e82b81d04')
    )
    // const siteMap = await getSiteMaps()[0]
    // const subPages = siteMap.canonicalPageMap
    console.log('SubPages from index: ', blocks)

    const props = {
      ...mainNotionPage,
      blocks
    }

    return {
      props,
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
