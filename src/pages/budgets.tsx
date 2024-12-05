/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { userObj, budget, budget_spending } from "../types"
import LatestSpending from "../components/budgets/latest_spending"
import NewBudgetForm from "../components/budgets/new_budget_form"
import { Link } from "react-router-dom"
import EditBudgetForm from "../components/budgets/edit_budget_form"
import DeleteBudgetForm from "../components/budgets/delete_budget_form"
import { roundPercentage } from "../helpers/helpers"

interface budgetProps {
    user: userObj,
    budgets: budget[],
    budgetSpending: budget_spending,
    updateBudgets: (budgetsArr: budget[]) => void,
    updateBudgetSpending: (spendingObj: budget_spending) => void,
}

function Budgets({ user, budgets, budgetSpending, updateBudgets, updateBudgetSpending }: budgetProps) {
    const [showNewForm, setShowNewForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showDeleteForm, setShowDeleteform] = useState(false)
    const [budgetToEdit, setBudgetToEdit] = useState<budget>({})
    // if new budget has been created
    const [newBudget, setNewBudget] = useState('')


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

            if (response.status === 200) {
                updateBudgets(data.budgets)
                updateBudgetSpending(data.budget_spending)

                return
            }

            // 401 status -> change auth status*


        } catch (error) {
            console.log(error)
        }
    }

    // get budget spending of newly created budget and update budget spending state
    async function getNewBudgetSpending() {
        try {
            const response = await fetch(`http://localhost:8000/finance-api/budgets/new/${newBudget}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            if (response.status === 200) {
                const data = await response.json()

                const newSpending = { ...budgetSpending, ...data }

                updateBudgetSpending(newSpending)
            }

        } catch (error) {
            console.log(error)
        }
    }

    // update new budget
    function updateNewBudget(name: string) {
        setNewBudget(name)
    }

    // hide new form
    function hideNewForm() {
        setShowNewForm(false)
    }

    // hide edit form
    function hideEditForm() {
        setShowEditForm(false)
    }

    // show edit form
    function displayEditForm(b: budget) {
        setBudgetToEdit(b)
        setShowEditForm(true)
        hideNewForm()
        hideDeleteForm()
    }

    // show delete form
    function displayDeleteForm(b: budget) {
        setBudgetToEdit(b)
        setShowDeleteform(true)
        hideNewForm()
        hideEditForm()
    }

    function hideDeleteForm() {
        setShowDeleteform(false)
    }

    useEffect(() => {
        if (!budgets.length || !budgetSpending.length) {
            getBudgets()
        }

        // if new budget has been created get the spending of that budget
        if (newBudget !== '') {
            getNewBudgetSpending()
        }

    }, [newBudget])

    return (
        <>
            <h1>Budgets</h1>
            <button data-testid="new-btn" onClick={() => setShowNewForm(true)}>+ Add New Budget</button>

            {/* spending summary */}
            {budgets.length > 0 &&
                <div>
                    <div className="budgets-summary">
                        {/* total spent and total limit */}
                        <span data-testid="total-spent">${Math.abs(Object.values(budgetSpending).reduce((a, c) => a + c, 0))}</span>
                        <span data-testid="limit">of ${budgets.reduce((a, c) => a + c.maximum, 0)} limit</span>

                        <h2>Spending Summary</h2>

                        <ul>
                            {budgets.map(budget =>
                                <li data-testid="summary-list" key={budget.id}>
                                    <div style={{ backgroundColor: budget.theme }}></div>
                                    <span>{budget.category}</span>
                                    <span data-testid="budget-spending">${Math.abs(budgetSpending[budget.category]).toFixed(2)} of ${budget.maximum.toFixed(2)}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                    {/* budgets detail list */}
                    <div className="budgets-detail">

                        {budgets.map(budget =>
                            <div key={budget.category}>
                                <div>
                                    <div>
                                        <div style={{ backgroundColor: budget.theme }}></div>
                                        <h2 data-testid="detail-category">{budget.category}</h2>
                                    </div>
                                    {/* toggle edit delete button* */}
                                    <button></button>
                                    <div className="">
                                        <button data-testid="edit-btn" onClick={() => displayEditForm(budget)}>Edit budget</button>
                                        <button data-testid="delete-btn" onClick={() => displayDeleteForm(budget)}>Delete budget</button>
                                    </div>
                                    <p>maximum of {budget.maximum}</p>
                                    <div>
                                        {/* spending bar* */}
                                        <div className="spending-bar">
                                            <div style={{ backgroundColor: budget.theme, width: `${roundPercentage((Math.abs(budgetSpending[budget.category]) / budget.maximum) * 100)}%` }}></div>
                                        </div>
                                        <div>
                                            <div style={{ backgroundColor: budget.theme }}></div>
                                            <span>Spent</span>
                                            <span data-testid="detail-spending">${Math.abs(budgetSpending[budget.category]).toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span>Remaining</span>
                                            <span data-testid="detail-remaining">${(budget.maximum - Math.abs(budgetSpending[budget.category])).toFixed(2)}</span>
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
                    <NewBudgetForm user={user} budgets={budgets} hideNewForm={hideNewForm} updateBudgets={updateBudgets} updateNewBudget={updateNewBudget} />
                </div>
            }

            {/* edit budget form */}
            {showEditForm &&
                <div className="form-modal">
                    <EditBudgetForm user={user} budget={budgetToEdit} budgets={budgets} hideEditForm={hideEditForm} updateBudgets={updateBudgets} />
                </div>
            }

            {/* delete form */}
            {showDeleteForm &&
                <div className="form-modal">
                    <DeleteBudgetForm user={user} budget={budgetToEdit} budgets={budgets} hideDeleteForm={hideDeleteForm} updateBudgets={updateBudgets} />
                </div>
            }

        </>
    )
}

export default Budgets