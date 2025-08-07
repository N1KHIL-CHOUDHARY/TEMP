import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 bg-black text-white min-h-screen p-6">
     <div className="ml-[220px] p-6 ">
   <Outlet />
 </div>

      </main>
    </div>
  )
}
