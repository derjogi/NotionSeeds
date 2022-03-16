import React from 'react'
import { isDev, domain } from 'lib/config'
import { getSiteMaps } from 'lib/get-site-maps'
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
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const siteMaps = await getSiteMaps()

  const ret = {
    paths: siteMaps.flatMap((siteMap) =>
      Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
        params: {
          pageId
        }
      }))
    ),
    // paths: [],
    fallback: true
  }

  console.log(ret.paths)
  return ret
}

export default function NotionDomainDynamicPage(props) {
  return <NotionPage {...props} />
}
