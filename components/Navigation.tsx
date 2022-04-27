import * as React from 'react'
import Link from 'next/link'
import navStyle from './navigation.module.css'
import hierarchy from '../lib/navigation.json'
import { useRouter } from 'next/router'
// import { isDev } from '../lib/config'
import { FaBars } from '@react-icons/all-files/fa/FaBars'

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
  const [width, setWidth] = React.useState(600);
  const maxWidthToCollapseMenu = 566;

  React.useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  const [navOpen, setShowNav] = React.useState(collapsed);
  const [subMenusToShow, updateList] = React.useState([]);

  const toggleSubMenu = (linkName) => {
    if (subMenusToShow.includes(linkName)) {
      updateList([...subMenusToShow.filter(item => item !== linkName)])
    } else {
      subMenusToShow.push(linkName)
      updateList([...subMenusToShow])
    }
  }

  function handleLinkClick(e) {
    // If we're at small screen size, we want to collapse the menu after a link is clicked.
    e.target
    if (width <= maxWidthToCollapseMenu) {
      setShowNav(false)
    }
  }

  // Not sure whether we actually want to toggle subs when the parent is clicked... ?
  // If we do, it can't be un-expanded while it's active. (or at least not easily.)
  // function showSubMenu(linkName) {
  //   // Similar to toggle, but doesn't remove it if it's there.
  //   if (!subMenusToShow.includes(linkName)) {
  //     subMenusToShow.push(linkName)
  //     updateList([...subMenusToShow])
  //   }
  // }

  function getValidLink(link: SingleLink): string {
    // if (isDev) {
    return link.id
    // }
    // return link.name.toLowerCase().replace(/\+/g, '').replace(/\s+/g, '-')
  }

  function createNavigation() {
    const mainNavLvl:SingleLink[] = hierarchy[0].subs

    function processLinksAt(navLevel:SingleLink[], lvl:number) {
      return navLevel.map((link, i) => {
        const target = getValidLink(link)
        const isActiveLink = router.asPath == "/"+ target
        const displayName = link.displayName ? link.displayName : link.name
        // if (isActiveLink) {
        //   showSubMenu(displayName)
        // }
        const icon = link.icon.endsWith(".png") ? (<img src={link.icon} width={32} alt={"🫥"}/>) : link.icon
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
                <div className={`${navStyle.linkLine} ${navStyle.clickable} ${isActiveLink?navStyle.activeLink:''}`} onClick={(e) => handleLinkClick(e)}>
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
                <div className={`${navStyle.linkLine} ${navStyle.clickable} ${isActiveLink?navStyle.activeLink:''}`} onClick={(e) => handleLinkClick(e)}>
                  {iconAndOptionalName}
                  <span className={navStyle.expander}>
                    <ToggleIcon show={show} onClick={(event) => {
                        event.preventDefault()
                        toggleSubMenu(displayName)
                      }} />
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

    return (
      <nav>
        <ul>
          <div>
            {processLinksAt(mainNavLvl, 0)}
          </div>
        </ul>
      </nav>
    )
  }

  const navigation = createNavigation()

  function creatTitle(link: SingleLink) {
    const displayName = link.displayName ? link.displayName : link.name
    const icon = link.icon.endsWith(".png") ? (<img className={navStyle.imageAsIcon} src={link.icon} width={32} alt={"🫥"}/>) : link.icon
    const iconAndOptionalName = (
      <a onClick={(e) => handleLinkClick(e)}><h2 className={`${navStyle.title} ${navStyle.linkLine}`}>
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

  const title = creatTitle(hierarchy[0])
  return (
    <div className={`${navStyle.navigation} ${navOpen?navStyle.open:navStyle.closed} light-mode ${className}`}>
      <div className={navStyle.burgerMenu}><a onClick={() => setShowNav(!navOpen)}><FaBars/></a></div>
      <div className={navOpen?'':navStyle.hide}>
        {title}
        {navigation}
      </div>
    </div>
  )
}
