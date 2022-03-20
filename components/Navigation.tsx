import * as React from 'react'
import * as config from 'lib/config'
import styles from './styles.module.css'
import { FaHamburger } from 'react-icons/fa'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'
import { BaseBlock, PageBlock, PageLink, ToggleBlock } from 'notion-types'
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

  type LinkAndTitle = {
    id?: string
    title?: string
  }

  function createNavigation(blocks: BaseBlock[]) {
    console.log(
      `${blocks.length} Blocks were passed in to construct the navigation`
    )
    if (blocks === undefined || blocks) {
      return <div>Loading Navigation...</div>
    }
    return (
      blocks
        // .filter((block) => ['page', 'alias'].includes(block.type))
        .map((block) => {
          const type = block.type
          let titleElement, id
          switch (type) {
            case 'page': {
              const page = block as PageBlock
              return (
                <MenuItem>
                  <Link href={page.id}>
                    <a>{page.properties?.title[0][0]}</a>
                  </Link>
                </MenuItem>
              )
            }
            case 'alias': {
              const link = block as PageLink
              id = link.format.alias_pointer.id
              titleElement = link.format.alias_pointer.id
              return (
                <MenuItem>
                  <Link href={id}>
                    <a>{titleElement}</a>
                  </Link>
                </MenuItem>
              )
            }
            case 'toggle': {
              // check the content, those IDs should be present as separate blocks:
              const submenus = []
              const toggle = block as ToggleBlock
              toggle.content.forEach((contentId) => {
                submenus.push(blocks.filter((b) => b.id === contentId)[0])
              })
              return (
                <SubMenu title={toggle.properties.title[0][0]}>
                  {submenus}
                </SubMenu>
              )
            }
            default:
              return <div />
          }
        })
    )
  }

  const links = createNavigation(blocks)

  console.log('Links to SubPages: ', links)

  return (
    <div>
      <ProSidebar>
        <Menu>{links}</Menu>
      </ProSidebar>
    </div>
  )
}
