import * as React from 'react'
import * as config from 'lib/config'
import styles from './styles.module.css'
import { FaHamburger } from 'react-icons/fa'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'
import { BaseBlock, PageLink } from 'notion-types'
import Link from 'next/link'

export const Navigation: React.FC<{
  collapsed: boolean
  blocks: BaseBlock[]
}> = ({ collapsed, blocks }) => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const toggleCollapsed = React.useCallback(
    (e) => {
      e.preventDefault()
      collapsed = !collapsed
    },
    [collapsed]
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  // const [links, setLinks] = React.useState([])
  // React.useEffect(() => {
  //   const fetchLinksFromNavigationPage = async () => {
  //     const pageRecord = await getPage('5507b637e0a349a4b722041e82b81d04')
  //     const pageBlocks = Object.values(pageRecord.block).filter(
  //       (block) => block.value.type === 'page'
  //     )
  //     setLinks(pageBlocks.map((block) => block.value.id))
  //   }
  //   fetchLinksFromNavigationPage()
  // }, [])

  type LinkAndTitle = {
    id?: string
    title?: string
  }

  function createLinksToSubPages(blocks: BaseBlock[]): LinkAndTitle[] {
    console.log('Blocks: ', blocks)
    if (blocks === undefined) {
      return []
    }
    return blocks
      .filter((block) => ['page', 'alias'].includes(block.type))
      .map((block) => {
        const type = block.type
        let titleElement, id
        switch (type) {
          case 'page':
            id = block.id
            titleElement = block.properties.title[0][0]
            break
          case 'alias': {
            const link = block as PageLink
            id = link.format.alias_pointer.id
            titleElement = link.format.alias_pointer.id
            break
          }
          default:
            break
        }
        if (titleElement) {
          console.log('Link Title: ', titleElement)
        }
        return {
          id: id,
          title: titleElement
        }
      })
  }

  const linksToSubPages = createLinksToSubPages(blocks)

  console.log('Links to SubPages: ', linksToSubPages)

  return (
    <div>
      <div className={styles.someClassName}>Some Text {config.author}</div>

      {hasMounted ? (
        <div className={styles.settings}>
          <a
            className={styles.toggleCollapse}
            onClick={toggleCollapsed}
            title='Collapse/Expand Menu'
          >
            <FaHamburger />
          </a>
        </div>
      ) : null}
      <ProSidebar>
        <Menu>
          {linksToSubPages.map((linkToPage) => (
            <MenuItem>
              <Link href={linkToPage.id}>
                <a>{linkToPage.title}</a>
              </Link>
            </MenuItem>
          ))}
          <MenuItem>Dashboard</MenuItem>
          <SubMenu title='Components'>
            <MenuItem>Component 1</MenuItem>
            <MenuItem>Component 2</MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar>
    </div>
  )
}
