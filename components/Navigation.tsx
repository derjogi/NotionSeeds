import * as React from 'react'
import Link from 'next/link'
import styles from './styles.module.css'
import { FaHamburger } from '@react-icons/all-files/fa/FaHamburger'
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight'
import Nav from '../lib/navigation.json'

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
    const navLvl1 = Nav

    function processLinksAt(navLevel) {
      return navLevel.map((link, i) => {
        if (!link.subs) {
          return (
            <li key={i}><Link href={link.target}>{link.name}</Link></li>
          )
        } else {
          return (
            <li>
              <FaAngleRight className={styles.clickable} onClick={() => toggleMenu(link.name)} />
              <Link
              href={link.target}>{link.name}</Link>
              <ul className={`${subMenusToShow.includes(link.name) ? '' : styles.hide}`}>
                {processLinksAt(link.subs)}
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
            {processLinksAt(navLvl1)}
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
