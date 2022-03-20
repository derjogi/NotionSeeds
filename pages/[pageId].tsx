import React from 'react'
import { isDev, domain } from 'lib/config'
import { getSiteMap } from 'lib/get-site-map'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'
import { getBlocksForSubPages } from '../lib/notion'
import { parsePageId } from 'notion-utils'

export const getStaticProps = async (context) => {
  const rawPageId = context.params.pageId as string

  try {
    if (rawPageId === 'sitemap.xml' || rawPageId === 'robots.txt') {
      return {
        redirect: {
          destination: `/api/${rawPageId}`
        }
      }
    }

    const pageProps = await resolveNotionPage(domain, rawPageId)
    const navigationBlocks = await getBlocksForSubPages(
      parsePageId('5507b637e0a349a4b722041e82b81d04')
    )

    return {
      props: {
        ...pageProps,
        blocks: navigationBlocks
      },
      revalidate: 10
    }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export async function getStaticPaths() {
  // This gets the data at BUILD time and returns paths, one path for each [pageId] that should be available.
  // Next.js is using those paths to create the routes (and prebuild pages?).
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const siteMap = await getSiteMap()
  const paths = Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
    params: {
      pageId
    }
  }))
  console.log('Pages available to browse: ', paths)

  return {
    paths,
    fallback: true
  }
}

export default function NotionDomainDynamicPage(props) {
  return <NotionPage {...props} />
}
