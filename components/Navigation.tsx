import * as React from 'react'
import Link from 'next/link'
import styles from './styles.module.css'
import Nav from '../lib/navigation.json'
import { useRouter } from 'next/router'
import { isDev } from '../lib/config'
import { IconContext } from '@react-icons/all-files'
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight'
import { FaAngleDown } from '@react-icons/all-files/fa/FaAngleDown'
import { FaRegDotCircle } from '@react-icons/all-files/fa/FaRegDotCircle'
import { FaRegCircle } from '@react-icons/all-files/fa/FaRegCircle'
import { FaBars } from '@react-icons/all-files/fa/FaBars'

interface SingleLink {
  name: string
  icon?: string
  id: string
  displayName?: string
  subs?: Sub
}

interface Sub {
  subs?: SingleLink[]
}

type LinkTree = SingleLink[] | Sub

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

  function getValidLink(link: SingleLink) {
    if (isDev) {
      return link.id
    }
    const target = link.name.toLowerCase().replaceAll('+', '').replaceAll(' ', '-')
    return target
  }

  function createNavigation() {
    const mainNavLvl:LinkTree[] = Nav[0].subs

    function processLinksAt(navLevel, lvl) {
      return navLevel.map((link, i) => {
        const target = getValidLink(link)
        const isActiveLink = router.asPath == "/"+ target
        const displayName = link.displayName ? link.displayName : link.name
        const icon = link.icon.endsWith(".png") ? (<img src={link.icon} width={32} alt={"🫥"}/>) : link.icon
        const iconAndOptionalName = (
          <a>
            {/*<span className={styles.levelIndicator}>{"-".repeat(lvl)}</span>*/}
            <span className={styles.icon}>{icon}</span>
            {navOpen? (<span className={styles.linkName}>{displayName}</span>) : ""}
          </a>
        )
        if (!link.subs) {
          return (
            <li key={i} className={`${styles.clickable} ${isActiveLink?styles.activeLink:null}`}>
              <Link href={target}>
                <a>
                  <IconContext.Provider value={{size: "10px"}}>
                    {isActiveLink ? <FaRegDotCircle/> : <FaRegCircle/>}
                  </IconContext.Provider>
                  {iconAndOptionalName}
                </a>
              </Link>
            </li>
          )
        } else {
          const show = subMenusToShow.includes(displayName)
          return (
            <li key={i}>
              <span className={styles.angleBrackets}>
              {show
                ? <FaAngleDown className={styles.clickable} onClick={() => toggleMenu(displayName)} />
                : <FaAngleRight className={styles.clickable} onClick={() => toggleMenu(displayName)} />
              }
              </span>
              <Link href={target}>
                {iconAndOptionalName}
              </Link>
              <ul className={`${show ? '' : styles.hide}`}>
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

  function creatTitle(link: any) {
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
