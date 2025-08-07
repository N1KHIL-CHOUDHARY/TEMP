import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AllPawns from './pages/AllPawns.jsx'
import Login from './pages/Login.jsx'
import Accounts from './pages/Accounts.jsx'
import NewPawn from './pages/Newpawn.jsx'
import Newaccount from './pages/Newaccount.jsx'
import UpdateAccount from './pages/UpdateAccount.jsx'
import Updatepawnticket from './pages/Updatepawnticket.jsx'
import Pawnbyaccount from './pages/Pawnbyaccount.jsx'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="Accounts" element={<Accounts />} />
          <Route path="pawns" element={<AllPawns />} />
          <Route path="history" element={<History />} />
          <Route path="pawnticket/add" element={<NewPawn />} />
          <Route path="Accounts/add" element={<Newaccount />} />
          <Route path="Accounts/update/:id" element={<UpdateAccount />} />
          <Route path="pawnticket/update/:id" element={<Updatepawnticket />} />
          <Route path="Accounts/:id" element={<Pawnbyaccount />} />
        </Route>
      </Routes>
    </Router>
  )
}