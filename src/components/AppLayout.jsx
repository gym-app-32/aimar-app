import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar/Sidebar'
import Topbar from './Topbar/Topbar'
import BottomBar from './BottomBar/BottomBar'
import styles from './AppLayout.module.scss'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={styles.layout}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(p => !p)}
      />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ''}`}>
        <Topbar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <BottomBar />
    </div>
  )
}