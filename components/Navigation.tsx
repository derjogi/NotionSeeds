import * as React from 'react'
import Link from 'next/link'
import navStyle from 'styles/navigation.module.css'
import navLinks from '../navigation.json'
import { useRouter } from 'next/router'
import { displayFirstLinkAsTitle } from '../lib/config'
import { FaBars } from '@react-icons/all-files/fa/FaBars'
import {useEffect, useState} from "react";

interface SingleLink {
  name: string
  icon?: string
  id: string
  displayName?: string
  subs?: SingleLink[]
}

const ToggleIcon = ({show, ...parentProps}) => {
  return (
    <div className={navStyle.toggleArrow} {...parentProps}>
      <svg width="12" height="10" className={show?navStyle.toggleExpanded:navStyle.toggleCollapsed}>
        <polygon fill="currentColor" points="0,0 12,0 6,10"/>
      </svg>
    </div>
  )
}

export const Navigation: React.FC<{
  collapsed: boolean,
  className: string
}> = ({ collapsed, className}) => {
  const router = useRouter()

  // Keep track of the window size so we can modify the default navOpen state
  const [width, setWidth] = useState<number>();
  const maxWidthToCollapseMenu = 566;
  const [navOpen, setShowNav] = useState(!collapsed && width>maxWidthToCollapseMenu);
  const [subMenusToShow, updateList] = useState([]);

  useEffect(() => {
    if (!width) {
      setWidth(window.innerWidth)
      setShowNav(window.innerWidth > maxWidthToCollapseMenu)
    }
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth)
      setShowNav(window.innerWidth > maxWidthToCollapseMenu)
    });
    console.log('Width from inside useEffect: ', width)
  }, [setWidth, width]);

  const toggleSubMenu = (linkName) => {
    if (subMenusToShow.includes(linkName)) {
      updateList([...subMenusToShow.filter(item => item !== linkName)])
    } else {
      subMenusToShow.push(linkName)
      updateList([...subMenusToShow])
    }
  }

  // Not sure whether we actually want to toggle subs when the parent is clicked... ?
  // Let's have it as an easy to tweak constant.
  const toggleSubMenuOnArrowOnly = false

  function handleLinkLineClick(e, displayName: string) {
    // If we're at small screen size, we want to collapse the menu after a link is clicked.
    // ... unless the arrow down is clicked, in which case we'd only want to trigger the expand action.
    const toggleArrowClicked = e.target.closest(`.${navStyle.toggleArrow}`) != null
    if (!toggleArrowClicked && width <= maxWidthToCollapseMenu) {
      setShowNav(false)
    }
    if (!toggleSubMenuOnArrowOnly) {
      toggleSubMenu(displayName)
    }
  }

  function handleToggleIconClick(e, displayName: string) {
    e.preventDefault()
    if (toggleSubMenuOnArrowOnly) {
      // if this is false then toggling will happen in the LinkLine handler
      toggleSubMenu(displayName)
    }
  }

  function getValidLink(link: SingleLink): string {
    return link.id
  }

  function getIcon(link: SingleLink) {
    const icon = link.icon?.endsWith(".png") ? (
      <img className={navStyle.imageAsIcon} src={link.icon} width={32} alt={"🫥"}/>) : link.icon
    return icon;
  }

  function processLinksAt(navLevel:SingleLink[], lvl:number) {
    return navLevel.map((link, i) => {
      const target = getValidLink(link)
      const isActiveLink = router.asPath == "/"+ target
      const displayName = link.displayName ? link.displayName : link.name
      const icon = getIcon(link)
      const iconAndOptionalName = (
        <a className={navStyle.clickable}>
          <span className={navStyle.icon}>{icon}</span>
          <span className={navStyle.linkName}>{displayName}</span>
        </a>
      )
      if (!link.subs) {
        return (
          <li key={i}>
            <Link href={target}>
              <div className={`${navStyle.linkLine} ${navStyle.clickable} ${isActiveLink?navStyle.activeLink:''}`} onClick={(e) => handleLinkLineClick(e, displayName)}>
                {iconAndOptionalName}
              </div>
            </Link>
          </li>
        )
      } else {
        const show = subMenusToShow.includes(displayName)
        return (
          <li key={i} className={isActiveLink ? navStyle.activeCategory : ''}>
            <Link href={target}>
              <div className={`${navStyle.linkLine} ${navStyle.clickable} ${isActiveLink?navStyle.activeLink:''}`} onClick={(e) => handleLinkLineClick(e, displayName)}>
                {iconAndOptionalName}
                <span className={navStyle.expander}>
                    <ToggleIcon show={show} onClick={(e) => handleToggleIconClick(e, displayName)} />
                  </span>
              </div>
            </Link>
            <ul className={`${show ? '' : navStyle.hide} ${isActiveLink ? navStyle.activeCategory : ''}`}>
              {processLinksAt(link.subs, lvl + 1)}
            </ul>
          </li>
        )
      }
    })
  }

  function createNavigation() {
    const mainNavLvl:SingleLink[] = displayFirstLinkAsTitle ? navLinks[0]?.subs : navLinks
    const links = processLinksAt(mainNavLvl, 0);
    return (
      <nav>
        <ul>
          <div>
            {links}
          </div>
        </ul>
      </nav>
    )
  }

  function creatTitle(link: SingleLink) {
    const displayName = link.displayName ? link.displayName : link.name
    const icon = getIcon(link);
    const iconAndOptionalName = (
      <a onClick={(e) => handleLinkLineClick(e, displayName)}><h2 className={`${navStyle.title} ${navStyle.linkLine}`}>
        <span className={navStyle.icon}>{icon}</span>
        <span className={navStyle.linkName}>{displayName}</span>
      </h2></a>
    )
    return (
      <Link href={getValidLink(link)}>
        {iconAndOptionalName}
      </Link>
    )
  }

  const title = creatTitle(navLinks[0])
  const navigation = createNavigation()
  return (
    <div className={`${navStyle.navigation} ${navOpen?navStyle.open:navStyle.closed} notion notion-app ${className}`}>
      <div className={navStyle.burgerMenu}>
        <a className={`${navStyle.clickable} notion-header breadcrumb button`}
           onClick={() => setShowNav(!navOpen)}>
          <FaBars/>
        </a>
      </div>
      <div className={navOpen?'':navStyle.hide}>
        {title}
        {navigation}
      </div>
    </div>
  )
}
