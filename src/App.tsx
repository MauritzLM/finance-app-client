import { useEffect, useState } from 'react'
import Auth from './components/auth/auth'
import Overview from './pages/overview'
import Navbar from './components/navbar'
import Transactions from './pages/transactions'
import Budgets from './pages/budgets'
import Pots from './pages/pots'
import RecurringBills from './pages/recurring_bills'
import ErrorPage from './pages/error_page'
import { Route, Routes } from 'react-router-dom'
import { userObj, pot, budget, budget_spending, transaction } from './types'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<userObj>({})
  const [pots, setPots] = useState<pot[]>([])
  const [budgets, setBudgets] = useState<budget[]>([])
  const [budgetSpending, setBudgetSpending] = useState<budget_spending>({})
  const [recurringBills, setRecurringBills] = useState<transaction[]>([])


  function updateUser(u: userObj) {
    setUser({ 'token': u.token, 'user': { ...u.user } })
    setIsAuthenticated(true)
  }

  // when token is expired
  function changeAuthStatus() {
    setIsAuthenticated(false)
  }

  // update pots function
  function updatePots(potsArr: pot[]) {
    setPots([...potsArr])
  }

  // update budgets function
  function updateBudgets(budgetsArr: budget[]) {
    setBudgets([...budgetsArr])
  }

  function updateBudgetSpending(spendingObj: budget_spending) {
    setBudgetSpending({ ...spendingObj })
  }

  // update recurring bills
  function updateRecurringBills(transactionArr: transaction[]) {
    setRecurringBills([...transactionArr])
  }

  // check if userobj in localstorage
  useEffect(() => {
    if (localStorage.user) {
      updateUser(JSON.parse(localStorage.user))
    }
  }, [])

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
      <div id='container'>
        <Navbar user={user} />
        <main>
          <Routes>
            <Route path='/' element={<Overview user={user} changeAuthStatus={changeAuthStatus} updatePots={updatePots} updateBudgets={updateBudgets} updateBudgetSpending={updateBudgetSpending} updateRecurringBills={updateRecurringBills} />} />
            <Route path='/transactions' element={<Transactions user={user} />} />
            <Route path='/budgets' element={<Budgets user={user} budgets={budgets} budgetSpending={budgetSpending} updateBudgets={updateBudgets} updateBudgetSpending={updateBudgetSpending} />} />
            <Route path='/pots' element={<Pots user={user} pots={pots} updatePots={updatePots} />} />
            <Route path='/recurring-bills' element={<RecurringBills user={user} recurringBills={recurringBills} updateRecurringBills={updateRecurringBills} />} />
            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
