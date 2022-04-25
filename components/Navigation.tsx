import * as React from 'react'
import Link from 'next/link'
import styles from './styles.module.css'
import Nav from '../lib/navigation.json'
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
    <div className={styles.toggleArrow} {...parentProps}>
      <svg width="12" height="10" className={show?styles.toggleExpanded:styles.toggleCollapsed}>
        <polygon fill="currentColor" points="0,0 12,0 6,10"/>
      </svg>
    </div>
  )
}

export const Navigation: React.FC<{
  collapsed: boolean
}> = ({ collapsed}) => {
  const [navOpen, setNavOpen] = React.useState(collapsed);
  const [subMenusToShow, updateList] = React.useState([]);

  const router = useRouter()

  const toggleMenu = (whatToToggle) => {
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
    const mainNavLvl:SingleLink[] = Nav[0].subs

    function processLinksAt(navLevel:SingleLink[], lvl:number) {
      return navLevel.map((link, i) => {
        const target = getValidLink(link)
        const isActiveLink = router.asPath == "/"+ target
        const displayName = link.displayName ? link.displayName : link.name
        const icon = link.icon.endsWith(".png") ? (<img src={link.icon} width={32} alt={"🫥"}/>) : link.icon
        const iconAndOptionalName = (
          <a className={styles.clickable}>
            <span className={styles.icon}>{icon}</span>
            {navOpen? (<span className={styles.linkName}>{displayName}</span>) : ""}
          </a>
        )
        if (!link.subs) {
          return (
            <li key={i}>
              <Link href={target}>
                <div className={`${styles.linkLine} ${styles.clickable} ${isActiveLink?styles.activeLink:null}`}>
                  {iconAndOptionalName}
                </div>
              </Link>
            </li>
          )
        } else {
          const show = subMenusToShow.includes(displayName)
          return (
            <li key={i} className={isActiveLink ? styles.activeCategory : ''}>
              <Link href={target}>
                <div className={`${styles.linkLine} ${styles.clickable} ${isActiveLink?styles.activeLink:''}`}>
                  {iconAndOptionalName}
                  <span className={styles.expander}>
                    <ToggleIcon show={show} onClick={(event) => {
                        event.preventDefault()
                        toggleMenu(displayName)
                      }} />
                  </span>
                </div>
              </Link>
              <ul className={`${show ? '' : styles.hide} ${isActiveLink ? styles.activeCategory : ''}`}>
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

  const links = createNavigation()

  function creatTitle(link: SingleLink) {
    const displayName = link.displayName ? link.displayName : link.name
    const icon = link.icon.endsWith(".png") ? (<img className={styles.imageAsIcon} src={link.icon} width={32} alt={"🫥"}/>) : link.icon
    const iconAndOptionalName = (
      <a><h2>
        <span className={styles.icon}>{icon}</span>
        {navOpen? (<span className={styles.linkName}>{displayName}</span>) : ""}
      </h2></a>
    )
    return (
      <Link href={getValidLink(link)}>
        {iconAndOptionalName}
      </Link>
    )
  }

  const title = creatTitle(Nav[0])
  return (
    <div className={`${styles.navigation} ${navOpen?styles.open:null} light-mode`}>
      <div className={styles.menu}><a onClick={() => setNavOpen(!navOpen)}><FaBars/></a></div>
      {title}
      {links}
    </div>
  )
}
