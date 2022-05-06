import * as React from 'react'
import cs from 'classnames'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { Header, Search, useNotionContext } from 'react-notion-x'
import * as types from 'notion-types'

import { useDarkMode } from 'lib/use-dark-mode'
import { navigationStyle, navigationLinks, isSearchEnabled } from 'lib/config'

import styles from 'styles/styles.module.css'
import {FiEdit3} from "@react-icons/all-files/fi/FiEdit3";

const ToggleThemeButton = () => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const onToggleTheme = React.useCallback(() => {
    toggleDarkMode()
  }, [toggleDarkMode])

  return (
    <div
      className={cs('breadcrumb', 'button', !hasMounted && styles.hidden)}
      onClick={onToggleTheme}
    >
      {hasMounted && isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
    </div>
  )
}

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  const context = useNotionContext()
  const {components, mapPageUrl} = context

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <div></div> {/* notion-nav-header has justify-content set to 'space-between'. This element is here to be the (empty) left element, the next one is centered, the next one right.*/}
        <div className={'notion-title'}>
          {/*block.properties.title  ... we actually don't want to show the title,
          at least not as long as we can't make it really nice.*/}
        </div>

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}

          <div className={cs('breadcrumb', 'button')}>
            <a href={`https://www.notion.so/seeds-explorers${mapPageUrl(block.id, context.recordMap)}-${block.id}`} target={'_blank'} rel={'noreferrer'}>
              <FiEdit3 size={16}/>
            </a>
          </div>

          <ToggleThemeButton />

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}
