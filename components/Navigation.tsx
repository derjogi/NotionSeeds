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
  const [navOpen, setShowNav] = React.useState(collapsed);
  const [subMenusToShow, updateList] = React.useState([]);

  const router = useRouter()

  const toggleSubMenu = (whatToToggle) => {
    console.log('Subs: ', subMenusToShow)
    const text = whatToToggle

    if (subMenusToShow.includes(text)) {
      updateList([...subMenusToShow.filter(item => item !== text)])
    } else {
      subMenusToShow.push(text)
      updateList([...subMenusToShow])
    }
  }

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
                <div className={`${navStyle.linkLine} ${navStyle.clickable} ${isActiveLink?navStyle.activeLink:null}`}>
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
                <div className={`${navStyle.linkLine} ${navStyle.clickable} ${isActiveLink?navStyle.activeLink:''}`}>
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
      <a><h2 className={`${navStyle.title} ${navStyle.linkLine}`}>
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
      <div className={navStyle.menu}><a onClick={() => setShowNav(!navOpen)}><FaBars/></a></div>
      <div className={navOpen?'':navStyle.hide}>
        {title}
        {navigation}
      </div>
    </div>
  )
}
