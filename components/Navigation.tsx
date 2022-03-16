import * as React from 'react'
import * as config from 'lib/config'
import styles from './styles.module.css'
import { FaHamburger } from 'react-icons/fa'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'
import { BaseBlock, PageLink, ToggleBlock } from 'notion-types'
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
    console.log('Blocks: ', blocks)
    if (blocks === undefined) {
      return <div />
    }
    return (
      blocks
        // .filter((block) => ['page', 'alias'].includes(block.type))
        .map((block) => {
          const type = block.type
          let titleElement, id
          switch (type) {
            case 'page':
              return (
                <MenuItem>
                  <Link href={block.id}>
                    <a>{block.properties.title[0][0]}</a>
                  </Link>
                </MenuItem>
              )
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
              block.content.forEach((contentId) => {
                submenus.push(blocks.filter((b) => b.id === contentId)[0])
              })
              return (
                <SubMenu title={(block as ToggleBlock).properties.title}>
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
