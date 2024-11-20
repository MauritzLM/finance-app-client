import { useEffect, useState } from 'react'
import './App.css'
import Auth from './components/auth/auth'
import Overview from './pages/overview'
import Navbar from './components/navbar'
import Transactions from './pages/transactions'
import Budgets from './pages/budgets'
import Pots from './pages/pots'
import RecurringBills from './pages/recurring_bills'
import ErrorPage from './pages/error_page'
import { Route, Routes } from 'react-router-dom'
import { userObj } from './types'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<userObj>({ 'token': '', 'user': { 'id': -1, 'username': '' } })

  function updateUser(u: userObj) {
    setUser({ 'token': u.token, 'user': { ...u.user } })
    setIsAuthenticated(true)
  }

  // check if userobj in localstorage
  useEffect(() => {
    if (localStorage.user) {
      updateUser(JSON.parse(localStorage.user))
    }
  },[])

  // if not authenticated go to login page
  if (!isAuthenticated) {
    return (
      <>
        <Auth updateUser={updateUser} />

      </>
    )
  }

  return (
    <>
      <Navbar user={user} />
      <main>
        <Routes>
          <Route path='/' element={<Overview user={user} />} />
          <Route path='/transactions' element={<Transactions user={user} />} />
          <Route path='/budgets' element={<Budgets user={user} />} />
          <Route path='/pots' element={<Pots user={user} />} />
          <Route path='/recurring-bills' element={<RecurringBills user={user} />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </main>

    </>
  )
}

export default App
