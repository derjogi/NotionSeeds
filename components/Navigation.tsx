import * as React from 'react'
import Link from 'next/link'
import styles from './styles.module.css'
import { FaHamburger } from '@react-icons/all-files/fa/FaHamburger'
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight'
import Nav from '../lib/navigation.json'

// import useSWR from 'swr'
// import { getSiteMap } from '../lib/cache'
// import axios from 'axios'

// const fetcher = (key):Partial<SiteMap> => {
//
//   console.log('Fetching results from ... local cache???', key)
//   return (
//     {
//     site: {
//       domain: 'https://www.notion.so/',
//       name: 'Seeds',
//       rootNotionPageId: '777bf16ebfc74d4faf96ed28b50de0f6',
//       rootNotionSpaceId: null,
//       description: 'SEEDS - for a regenerative world',
//       timestamp: new Date(),
//       isDisabled: false
//     },
//     pageMap: {
//       '777bf16e-bfc7-4d4f-af96-ed28b50de0f6': null,
//       'cbef6961-b022-49a0-9111-505a32a19f95': null,
//       '1d2ad85a-7e16-47d8-ba75-4c436734fe19': null,
//       '0057aef5-259f-457c-b731-5ffe04c8153a': null,
//       '2ec63e24-0592-4b3b-a62c-80fadcb78037': null
//     },
//     canonicalPageMap: {
//       'buying-things': '777bf16e-bfc7-4d4f-af96-ed28b50de0f6',
//       'last-one': 'cbef6961-b022-49a0-9111-505a32a19f95',
//       cars: '1d2ad85a-7e16-47d8-ba75-4c436734fe19',
//       'empty-subpage-to-buying-things': '0057aef5-259f-457c-b731-5ffe04c8153a',
//       'another-subpage': '2ec63e24-0592-4b3b-a62c-80fadcb78037'
//     },
//     hierarchy: {
//       '777bf16e-bfc7-4d4f-af96-ed28b50de0f6': ['0057aef5-259f-457c-b731-5ffe04c8153a', '1d2ad85a-7e16-47d8-ba75-4c436734fe19'],
//       'cbef6961-b022-49a0-9111-505a32a19f95': [],
//       '1d2ad85a-7e16-47d8-ba75-4c436734fe19': [],
//       '0057aef5-259f-457c-b731-5ffe04c8153a': ['2ec63e24-0592-4b3b-a62c-80fadcb78037'],
//       '2ec63e24-0592-4b3b-a62c-80fadcb78037': []
//     }
//   })
// }

// interface LinkElement {
//   name: string
//   target: string
//   subs?: LinkElement[]
// }


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
      console.log(`Processing NavLevel with data: ${JSON.stringify(navLevel)}`)
      return navLevel.map((link, i) => {
      console.log(`Processing ${link.name}`)
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

  console.log('Links to SubPages: ', links)

  return (
    <div className={`${styles.navigation} ${navOpen?styles.open:null} light-mode`}>
      <a onClick={() => setNavOpen(!navOpen)}><FaHamburger/></a>
      {links}
    </div>
  )
}
