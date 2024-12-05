import { useEffect, useState } from "react"
import { userObj, overviewData, transaction, pot, budget, budget_spending } from "../types"
import { Link } from "react-router-dom"
import { isPaid, isUpcoming, dueSoon, formatTransaction } from "../helpers/helpers"

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
                        <span data-testid="balance">${income && expenses ? (income + expenses).toFixed(2) : 0}</span>
                    </div>
                    <div>
                        <span>Income</span>
                        <span data-testid="income">${income ? income.toFixed(2) : ''}</span>
                    </div>
                    <div>
                        <span>Expenses</span>
                        <span data-testid="expenses">${expenses ? Math.abs(expenses).toFixed(2) : ''}</span>
                    </div>
                </div>
                {/* pots */}
                <div className="pots">
                    <h2>Pots</h2>
                    {/* total */}
                    <Link to="/pots">See Details</Link>
                    {Object.keys(overviewData).includes('pots') &&
                        <div>
                            <div className="total">
                                <span>Total Saved</span>
                                <span data-testid="pots-total">${Math.floor(overviewData.pots.reduce((a, c) => a + c.total, 0))}</span>
                            </div>

                            <ul>
                                {overviewData.pots.slice(0, 4).map(pot =>
                                    <li data-testid='pot-item' key={pot.name}>
                                        <div style={{ backgroundColor: pot.theme }}></div>
                                        <span>{pot.name}</span>
                                        <span data-testid="pot-total">${Math.floor(pot.total)}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    }
                </div>
                {/* budgets */}
                <div className="budgets">
                    <h2>Budgets</h2>
                    <Link to="/budgets">See Details</Link>
                    {Object.keys(overviewData).includes('budgets') &&
                        <div>
                            {/* calculate total spent* */}
                            <span data-testid="budgets-spent">${Math.floor(Math.abs(Object.values(overviewData.budget_spending).reduce((a, c) => a + c, 0)))}</span>
                            {/* limit */}

                            <span data-testid="budgets-limit">of ${overviewData.budgets.reduce((a, c) => a + c.maximum, 0)} limit</span>
                            <ul>
                                {overviewData.budgets.slice(0, 4).map(budget =>
                                    <li key={budget.category} >
                                        <div style={{ backgroundColor: budget.theme }}></div>
                                        <span>{budget.category}</span>
                                        <span data-testid="budget-maximum">${budget.maximum.toFixed(2)}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    }
                </div>
                {/* transactions */}
                <div className="transactions">
                    <h2>Transactions</h2>
                    <Link to="/transactions">View All</Link>
                    <ul>
                        {Object.keys(overviewData).includes('recent_transactions') && overviewData.recent_transactions.map(item =>
                            <li data-testid="transaction" key={item.date}>
                                <div>
                                    {/* img* */}
                                    <span>{item.name}</span>
                                </div>
                                <div>
                                    {/* format amount +/-* */}
                                    <span data-testid="t-amount" className={item.amount < 0 ? '' : 'income'}>{formatTransaction(item.amount.toString())}</span>
                                    <span data-testid="t-dates">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>

                            </li>
                        )}
                    </ul>
                </div>
                {/* recurring bills */}
                <div className="recurring-bills">
                    <h2>Recurring Bills</h2>

                    {Object.keys(overviewData).includes('recurring_bills') &&
                        <ul>
                            <li data-testid="recurring-item">
                                <span>Paid Bills</span>
                                <span data-testid="paid">${Math.abs(overviewData.recurring_bills.filter(isPaid).reduce((a, c) => a + c.amount, 0)).toFixed(2)}</span>
                            </li>
                            <li data-testid="recurring-item">
                                <span>Total Upcoming</span>
                                <span>${Math.abs(overviewData.recurring_bills.filter(isUpcoming).reduce((a, c) => a + c.amount, 0)).toFixed(2)}</span>
                            </li>
                            <li data-testid="recurring-item">
                                <span>Due Soon</span>
                                <span>${Math.abs(overviewData.recurring_bills.filter(dueSoon).reduce((a, c) => a + c.amount, 0)).toFixed(2)}</span>
                            </li>
                        </ul>
                    }
                </div>
            </div>
        </>
    )
}

export default Overview