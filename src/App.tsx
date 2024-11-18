import { useState } from 'react'
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState('')

  // get token from local storage

  // if no token display login page

  // else attempt to fetch overview content

  // if token expired -> login page
  if (!isAuthenticated) {
    return (
      <>
        <Auth />

      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path='/' element={<Overview />} />
          <Route path='/transactions' element={<Transactions />} />
          <Route path='/budgets' element={<Budgets />} />
          <Route path='/pots' element={<Pots />} />
          <Route path='/recurring-bills' element={<RecurringBills />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </main>

    </>
  )
}

export default App
