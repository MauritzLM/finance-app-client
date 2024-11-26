import { useEffect, useState } from "react"
import { userObj, overviewData, transaction, pot, budget, budget_spending } from "../types"
import { Link } from "react-router-dom"
import { isPaid, totalUpcoming, dueSoon } from "../helpers/helpers"

interface overviewProps {
    user: userObj,
    changeAuthStatus: () => void,
    updatePots: (potsArr: pot[]) => void,
    updateBudgets: (budgetsArr: budget[]) => void,
    updateBudgetSpending: (spendingObj: budget_spending) => void,
    updateRecurringBills: (transactionArr: transaction[]) => void
}

function Overview({ user, changeAuthStatus, updatePots, updateBudgets, updateBudgetSpending, updateRecurringBills }: overviewProps) {
    const [overviewData, setOverviewData] = useState<overviewData>({})
    const [expenses, setExpenses] = useState<number>()
    const [income, setIncome] = useState<number>()

    function getBalance(i: number = 0, e: number = 0) {
        return i + e
    }

    // fetch overview content
    async function getOverviewData() {
        try {
            const response = await fetch('http://localhost:8000/finance-api/overview', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data: overviewData = await response.json()

            if (response.status === 401) {
                changeAuthStatus()
                // clear localstorage
                localStorage.removeItem('user')
                return
            }

            if (response.status === 200) {
                // set overview data
                setOverviewData(data)

                // update pots, budgets and recurringbills
                updatePots(data.pots)
                updateBudgets(data.budgets)
                updateBudgetSpending(data.budget_spending)
                updateRecurringBills(data.recurring_bills)

                // calculate and set income and expenses
                setExpenses(data.expenses.reduce((a: number, c: transaction) => a + c.amount, 0))
                setIncome(data.income.reduce((a: number, c: transaction) => a + c.amount, 0))
            }

            console.log(data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (Object.keys(overviewData).length !== 6) {
            getOverviewData()
        }
    }, [])

    return (
        <>
            <div className="container">
                <div className="balance">
                    <div>
                        <span>Balance</span>
                        <span>{getBalance(income, expenses)}</span>
                    </div>
                    <div>
                        <span>Income</span>
                        <span>{income ? income : ''}</span>
                    </div>
                    <div>
                        <span>Expenses</span>
                        <span>{expenses ? Math.abs(expenses) : ''}</span>
                    </div>
                </div>

                <div className="pots">
                    <h2>Pots</h2>
                    {/* total */}
                    <Link to="/pots">See Details</Link>
                    {Object.keys(overviewData).includes('pots') &&
                        <div>
                            <div className="total">
                                <span>Total Saved</span>
                                <span>{overviewData.pots.reduce((a, c) => a + c.total, 0)}</span>
                            </div>


                            <ul>
                                {overviewData.pots.slice(0, 4).map(pot =>
                                    <li key={pot.name}>
                                        <span>{pot.name}</span>
                                        <span>{pot.total}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    }
                </div>

                <div className="budgets">
                    <h2>Budgets</h2>
                    {Object.keys(overviewData).includes('budgets') &&
                        <div>
                            {/* calculate total spent* */}
                            <span>{Math.abs(Object.values(overviewData.budget_spending).reduce((a, c) => a + c, 0))}</span>
                            {/* limit */}

                            <span>of {overviewData.budgets.reduce((a, c) => a + c.maximum, 0)} limit</span>
                            <ul>
                                {overviewData.budgets.map(budget =>
                                    <li key={budget.category}>
                                        {/* theme color* */}
                                        <span>{budget.category}</span>
                                        <span>{budget.maximum}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    }
                </div>

                <div className="transactions">
                    <h2>Transactions</h2>
                    <Link to="/transactions">View All</Link>
                    <ul>
                        {Object.keys(overviewData).includes('recent_transactions') && overviewData.recent_transactions.map(item =>
                            <li key={item.date}>
                                <div>
                                    {/* img* */}
                                    <span>{item.name}</span>
                                </div>
                                <div>
                                    {/* format amount +/- */}
                                    <span>{item.amount}</span>
                                    <span>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>

                            </li>
                        )}
                    </ul>


                </div>

                <div className="recurring-bills">
                    <h2>Recurring Bills</h2>
                    {/* paid */}
                    {/* Number(new Date().toLocaleDateString('en-GB', {'day': 'numeric'})) Number(new Date(item.date).toLocaleDateString('en-GB', {'day': 'numeric'})) */}
                    {Object.keys(overviewData).includes('recurring_bills') &&
                        <ul>
                            <li>
                                <span>Paid Bills</span>
                                {/* calculate amount* */}
                                <span>${Math.abs(overviewData.recurring_bills.filter(isPaid).reduce((a, c) => a + c.amount, 0))}</span>
                            </li>
                            <li>
                                <span>Total Upcoming</span>
                                {/* calculate amount* */}
                                <span>${Math.abs(overviewData.recurring_bills.filter(totalUpcoming).reduce((a, c) => a + c.amount, 0))}</span>
                            </li>
                            <li>
                                <span>Due Soon</span>
                                {/* calculate amount* */}
                                <span>${Math.abs(overviewData.recurring_bills.filter(dueSoon).reduce((a, c) => a + c.amount, 0))}</span>
                            </li>
                        </ul>
                    }
                </div>
            </div>
        </>
    )
}

export default Overview