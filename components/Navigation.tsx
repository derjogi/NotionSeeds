import * as React from 'react'
import Link from 'next/link'
import styles from './styles.module.css'
import { FaHamburger } from '@react-icons/all-files/fa/FaHamburger'
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight'
import Nav from '../lib/navigation.json'
import { FaAngleDown } from '@react-icons/all-files/fa/FaAngleDown'

export const Navigation: React.FC<{
  collapsed: boolean
}> = ({ collapsed}) => {
  const [navOpen, setNavOpen] = React.useState(collapsed);
  const [subMenusToShow, updateList] = React.useState([]);

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

  function createNavigation() {
    const mainNavLvl = Nav[0].subs

    function processLinksAt(navLevel, lvl) {
      return navLevel.map((link, i) => {
        const displayName = link.displayName ? link.displayName : link.name
        const icon = link.icon.endsWith(".png") ? (<img src={link.icon} width={32} alt={"🫥"}/>) : link.icon
        const iconAndOptionalName = (
          <a>
            <span className={styles.levelIndicator}>{"-".repeat(lvl)}</span>
            <span className={styles.icon}>{icon}</span>
            {navOpen? (<span className={styles.linkName}>{displayName}</span>) : ""}
          </a>
        )
        if (!link.subs) {
          return (
            <li key={i}>
              <Link href={link.target}>
                {iconAndOptionalName}
              </Link>
            </li>
          )
        } else {
          const show = subMenusToShow.includes(displayName)
          return (
            <li>
              {show
                ? <FaAngleDown className={styles.clickable} onClick={() => toggleMenu(displayName)} />
                : <FaAngleRight className={styles.clickable} onClick={() => toggleMenu(displayName)} />
              }
              <Link href={link.target}>
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
  return (
    <div className={`${styles.navigation} ${navOpen?styles.open:null} light-mode`}>
      <a onClick={() => setNavOpen(!navOpen)}><FaHamburger/></a>
      {links}
    </div>
  )
}
