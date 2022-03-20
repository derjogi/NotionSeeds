import { parsePageId } from 'notion-utils'
import { ExtendedRecordMap } from 'notion-types'

import * as acl from './acl'
import * as types from './types'
import { pageUrlOverrides, pageUrlAdditions } from './config'
import { getPage } from './notion'
import { getSiteMap } from './get-site-map'
import { getSiteForDomain } from './get-site-for-domain'

export async function resolveNotionPage(domain: string, rawPageUri?: string) {
  let pageId: string
  let site: types.Site
  let recordMap: ExtendedRecordMap
  const preferCached = true

  console.log('PageId in resolve-notion-page = ' + rawPageUri)

  async function getPageResources() {
    const resources = await Promise.all([
      getSiteForDomain(domain),
      getPage(pageId)
    ])

    site = resources[0]
    recordMap = resources[1]
  }

  if (rawPageUri && rawPageUri !== 'index') {
    pageId = parsePageId(rawPageUri)

    if (!pageId) {
      // check if the site configuration provides an override of a fallback for
      // the page's URI
      const override =
        pageUrlOverrides[rawPageUri] || pageUrlAdditions[rawPageUri]

      if (override) {
        pageId = parsePageId(override)
      }
    }
    if (pageId) {
      await getPageResources()
    } else {
      console.log(`${rawPageUri} is not a valid pageId, checking whether we have a mapping in the sitemap...`)
      // handle mapping of user-friendly canonical page paths to Notion page IDs
      // e.g., /foo versus /71201624b204481f862630ea25ce62fe
      const siteMap = await getSiteMap()
      pageId = siteMap?.canonicalPageMap?.[rawPageUri]
      console.log(`... done getting sitemap; pageId for ${rawPageUri} is: '${pageId}'` )

      if (pageId) {
        if (preferCached) {
          site = await getSiteForDomain(domain)
          recordMap = siteMap.pageMap[pageId]
        } else {
          await getPageResources()
        }
      } else {
        return {
          error: {
            message: `Not found "${rawPageUri}"`,
            statusCode: 404
          }
        }
      }
    }
  } else {
    // resolve the site's home page
    site = await getSiteForDomain(domain)
    pageId = site.rootNotionPageId

    // console.log(site)
    recordMap = await getPage(pageId)
  }

  const props = { site, recordMap, pageId }
  return { ...props, ...(await acl.pageAcl(props)) }
}
