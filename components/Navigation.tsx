import * as React from 'react'
import * as config from 'lib/config'
import styles from './styles.module.css'
import { FaHamburger } from 'react-icons/fa'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'

export const Navigation: React.FC<{
  collapsed: boolean
  links
}> = ({ collapsed, links }) => {
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

  return (
    <div>
      <div className={styles.someClassName}>Some Text {config.author}</div>

      {hasMounted ? (
        <div className={styles.settings}>
          <a
            className={styles.toggleCollapse}
            onClick={toggleCollapsed}
            title='Collapse/Expand Menu'
          >
            <FaHamburger />
          </a>
        </div>
      ) : null}
      {links.length > 0 ? <div>Some links loaded</div> : <div>Loading...</div>}
      <ProSidebar>
        <Menu>
          <MenuItem>Dashboard</MenuItem>
          <SubMenu title='Components'>
            <MenuItem>Component 1</MenuItem>
            <MenuItem>Component 2</MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar>
    </div>
  )
}
