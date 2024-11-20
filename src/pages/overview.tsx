import { useEffect, useState } from "react"
import { userObj, overviewData, transaction } from "../types"
import { Link } from "react-router-dom"

interface overviewProps {
    user: userObj
}

function Overview({ user }: overviewProps) {
    const [overviewData, setOverviewData] = useState<overviewData | undefined>()
    const [expenses, setExpenses] = useState<number>()
    const [income, setIncome] = useState<number>()

    function getBalance(i: number = 0, e: number = 0) {
        return i + e
    }

    // fetch overview content
    async function getOverviewData() {
        try {
            const response = await fetch('http://localhost:8000/finance-api/overview', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
                body: JSON.stringify(user)
            })

            const data = await response.json()

            if (response.status === 200) {
                // set overview data
                setOverviewData(data)

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
        getOverviewData()
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
                    <div className="total">
                        {overviewData?.pots.reduce((a, c) => a + c.total, 0)}
                    </div>

                    {/* pot list */}
                    <ul>
                        {overviewData?.pots.map(pot =>
                            <li key={pot.name}>
                                {pot.total}
                            </li>
                        )}
                    </ul>
                </div>

                <div className="budgets">
                    <h2>Budgets</h2>
                    {/* total spent */}
                    {overviewData?.budgets.reduce((a, c) => a + c.maximum, 0)}

                    {/* list */}
                    <ul>
                        {overviewData?.budgets.map(budget =>
                            <li>
                                {/* theme color* */}
                                <span>{budget.category}</span>
                                <span>{budget.maximum}</span>
                            </li>
                        )}
                    </ul>

                </div>

                <div className="transactions">
                    <h2>Transactions</h2>
                    <Link to="/transactions">View All</Link>
                    <ul>
                        {overviewData?.recent_transactions.map(item =>
                            <li>
                                <div>
                                    {/* img* */}
                                    <span>{item.name}</span>
                                </div>
                                <div>
                                    <span>{item.amount}</span>
                                    <span>{new Date(item.date).toLocaleDateString('en-GB')}</span>
                                </div>

                            </li>
                        )}
                    </ul>


                </div>

                <div className="recurring-bills">
                    <h2>Recurring Bills</h2>
                    {/* paid */}
                    <ul>
                        <li>
                            <span>Paid Bills</span>
                            {/* calculate amount */}
                            <span></span>
                        </li>
                        <li>
                            <span>Total Upcoming</span>
                            {/* calculate amount */}
                            <span></span>
                        </li>
                        <li>
                            <span>Due Soon</span>
                            {/* calculate amount */}
                            <span></span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Overview