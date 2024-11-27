/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { userObj, budget, budget_spending } from "../types"
import LatestSpending from "../components/budgets/latest_spending"
import NewBudgetForm from "../components/budgets/new_budget_form"
import { Link } from "react-router-dom"

interface budgetProps {
    user: userObj,
    budgets: budget[],
    budgetSpending: budget_spending,
    updateBudgets: (budgetsArr: budget[]) => void,
    updateBudgetSpending: (spendingObj: budget_spending) => void,
}

function Budgets({ user, budgets, budgetSpending, updateBudgets, updateBudgetSpending }: budgetProps) {
    const [showNewForm, setShowNewForm] = useState(false)

    // fetch budgets and spending if not in props
    async function getBudgets() {
        try {
            const response = await fetch('http://localhost:8000/finance-api/budgets', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data = await response.json()

            updateBudgets(data.budgets)
            updateBudgetSpending(data.budget_spending)


        } catch (error) {
            console.log(error)
        }
    }

    // hide form
    function hideNewForm() {
        setShowNewForm(false)
    }

    useEffect(() => {
        if (!budgets.length || !budgetSpending.length) {
            getBudgets()
        }
    }, [])

    return (
        <>
            <h1>Budgets</h1>
            <button onClick={() => setShowNewForm(true)}>+ Add New Budget</button>

            {/* summary */}
            {budgets.length > 0 &&
                <div>
                    <div className="budgets-summary">

                        <span>{Math.abs(Object.values(budgetSpending).reduce((a, c) => a + c, 0))}</span>
                        <span>of {budgets.reduce((a, c) => a + c.maximum, 0)} limit</span>

                        <h2>Spending Summary</h2>

                        <ul>
                            {budgets.map(budget =>
                                <li key={budget.id}>
                                    <span>{budget.category}</span>
                                    <span>{Math.abs(budgetSpending[budget.category])} of {budget.maximum}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                    {/* list */}
                    <div className="budgets-detail">

                        {budgets.map(budget =>
                            <div key={budget.category}>
                                <div>
                                    <h2>{budget.category}</h2>
                                    <button></button>
                                    <p>maximum of {budget.maximum}</p>
                                    <div>
                                        {/* spending bar* */}
                                        <div></div>
                                        <div>
                                            <span>Spent</span>
                                            <span>{Math.abs(budgetSpending[budget.category])}</span>
                                        </div>
                                        <div>
                                            <span>Remaining</span>
                                            <span>{budget.maximum - Math.abs(budgetSpending[budget.category])}</span>
                                        </div>

                                    </div>
                                </div>

                                {/* latest spending */}
                                <div>
                                    <h3>Latest Spending</h3><Link to="/transactions">See All</Link>
                                    <LatestSpending user={user} category={budget.category} />
                                </div>
                            </div>
                        )
                        }
                    </div>
                </div>
            }
            {/* new budget form */}
            {showNewForm &&
                <div className="form-modal">
                    <NewBudgetForm user={user} budgets={budgets} hideNewForm={hideNewForm}/>
                </div>
            }

        </>
    )
}

export default Budgets