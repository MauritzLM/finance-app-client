/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { userObj, budget, budget_spending } from "../types"
import LatestSpending from "../components/budgets/latest_spending"
import NewBudgetForm from "../components/budgets/new_budget_form"
import { Link } from "react-router-dom"
import EditBudgetForm from "../components/budgets/edit_budget_form"
import DeleteBudgetForm from "../components/budgets/delete_budget_form"

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
    const [newBudget, setNewBudget] = useState('')
    const [budgetToEdit, setBudgetToEdit] = useState<budget>({})

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

    // hide form
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

        if (newBudget !== '') {
            getNewBudgetSpending()
        }

    }, [newBudget])

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
                                    <span>{Math.abs(budgetSpending[budget.category]).toString()} of {budget.maximum}</span>
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
                                    {/* toggle button* */}
                                    <button></button>
                                    <div className="">
                                        <button onClick={() => displayEditForm(budget)}>Edit budget</button>
                                        <button onClick={() => displayDeleteForm(budget)}>Delete budget</button>
                                    </div>
                                    <p>maximum of {budget.maximum}</p>
                                    <div>
                                        {/* spending bar* */}
                                        <div></div>
                                        <div>
                                            <span>Spent</span>
                                            <span>{Math.abs(budgetSpending[budget.category]).toString()}</span>
                                        </div>
                                        <div>
                                            <span>Remaining</span>
                                            <span>{(budget.maximum - Math.abs(budgetSpending[budget.category])).toString()}</span>
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
                 <DeleteBudgetForm user={user} budget={budgetToEdit} budgets={budgets} hideDeleteForm={hideDeleteForm} updateBudgets={updateBudgets}/>
              </div>
            }

        </>
    )
}

export default Budgets