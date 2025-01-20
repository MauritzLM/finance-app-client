/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { userObj, budget, budget_spending } from "../types"
import LatestSpending from "../components/budgets/latest_spending"
import NewBudgetForm from "../components/budgets/new_budget_form"
import { Link } from "react-router-dom"
import EditBudgetForm from "../components/budgets/edit_budget_form"
import DeleteBudgetForm from "../components/budgets/delete_budget_form"
import { roundPercentage, calculateOffset } from "../helpers/helpers"
import "../assets/sass/budgets.scss"

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
    const [budgetToEdit, setBudgetToEdit] = useState<budget>({ 'name': '', 'id': 0, 'category': '', 'maximum': 0, 'theme': '' })
    // if new budget has been created
    const [newBudget, setNewBudget] = useState('')

    const [currentToggle, setCurrentToggle] = useState('')


    // fetch budgets and spending if not in props
    async function getBudgets() {
        try {
            const response = await fetch('https://web-production-de787.up.railway.app/finance-api/budgets', {
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
        setCurrentToggle('')
    }

    // show delete form
    function displayDeleteForm(b: budget) {
        setBudgetToEdit(b)
        setShowDeleteform(true)
        hideNewForm()
        hideEditForm()
        setCurrentToggle('')
    }

    function hideDeleteForm() {
        setShowDeleteform(false)
    }

    // edit / delete toggle
    function handleToggle(category: string) {
        if (currentToggle === category) {
            setCurrentToggle('')
        }

        else {
            setCurrentToggle(category)
        }
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
            <section className="header">
                <h1>Budgets</h1>
                <button data-testid="new-btn" onClick={() => setShowNewForm(true)} className="new-btn">+ Add New Budget</button>
            </section>

            {/* spending summary */}
            {budgets.length > 0 &&
                <div className="budgets-wrapper">
                    <div className="budgets-summary">
                        {/* total spent and total limit */}
                        <div className="color-wheel">
                            <div className="total">
                                <span data-testid="total-spent">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                    {Math.abs(Object.values(budgetSpending).reduce((a, c) => a + c, 0)) / 100}
                                </span>
                                <span data-testid="limit">of <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                    {budgets.reduce((a, c) => a + c.maximum, 0) / 100} limit
                                </span>
                            </div>

                            <svg width="240" height="240" viewBox="0 0 240 240">
                                {budgets.map((b, i) =>
                                    <circle key={`${i}-c`} className="bg"
                                        cx="120" cy="120" r="104" fill="none" stroke={b.theme} strokeWidth="32" strokeDasharray={`${(b.maximum / (budgets.reduce((a, c) => a + c.maximum, 0))) * 653.45} ${653.45 - (b.maximum / (budgets.reduce((a, c) => a + c.maximum, 0)) * 653.45)}`}
                                        strokeDashoffset={calculateOffset(i, budgets, 653.45)}
                                    ></circle>
                                )}
                            </svg>
                        </div>

                        <div className="spending-summary">
                            <h2>Spending Summary</h2>

                            <ul>
                                {budgets.map(budget =>
                                    <li data-testid="summary-list" key={budget.id}>
                                        <div>
                                            <div style={{ backgroundColor: budget.theme }}></div>
                                            <span>{budget.category}</span>
                                        </div>

                                        <div data-testid="budget-spending">
                                            <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                                {(Math.abs(budgetSpending[budget.category]) / 100).toFixed(2)}
                                            </span>
                                            <span>of <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                                {(budget.maximum / 100).toFixed(2)}
                                            </span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    {/* budgets detail list */}
                    <div className="budgets-detail">

                        {budgets.map(budget =>
                            <section className="budget" key={budget.category}>
                                <div>
                                    <div className="heading">
                                        <div style={{ backgroundColor: budget.theme }}></div>
                                        <h2 data-testid="detail-category">{budget.category}</h2>
                                    </div>
                                    {/* toggle edit delete button* */}

                                    <button className={currentToggle === budget.category ? 'toggle-btn cs-active' : 'toggle-btn'} onClick={() => handleToggle(budget.category)}>
                                        <svg fill="none" height="4" viewBox="0 0 14 4" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m8.75 2c0 .34612-.10264.68446-.29493.97225-.19229.28778-.4656.51209-.78537.64454s-.67164.16711-1.01111.09958c-.33946-.06752-.65128-.23419-.89603-.47893-.24474-.24474-.41141-.55657-.47893-.89603-.06753-.33947-.03287-.69134.09958-1.01111.13246-.31977.35676-.593079.64454-.785372.28779-.192292.62613-.294928.97225-.294928.46413 0 .90925.184375 1.23744.512563.32819.328187.51256.773307.51256 1.237437zm-6.75-1.75c-.34612 0-.68446.102636-.97225.294928-.287783.192293-.512085.465602-.644538.785372-.132454.31977-.16711.67164-.099585 1.01111.067524.33946.234195.65129.478937.89603.244746.24474.556566.41141.896026.47893.33947.06753.69134.03287 1.01111-.09958s.59308-.35676.78537-.64454c.1923-.28779.29493-.62613.29493-.97225 0-.46413-.18437-.90925-.51256-1.237437-.32819-.328188-.77331-.512563-1.23744-.512563zm10 0c-.3461 0-.6845.102636-.9722.294928-.2878.192293-.5121.465602-.6446.785372-.1324.31977-.1671.67164-.0996 1.01111.0676.33946.2342.65129.479.89603.2447.24474.5565.41141.896.47893.3395.06753.6913.03287 1.0111-.09958s.5931-.35676.7854-.64454c.1923-.28779.2949-.62613.2949-.97225 0-.22981-.0453-.45738-.1332-.6697-.088-.21232-.2169-.405234-.3794-.567737-.1625-.162502-.3554-.291407-.5677-.379352-.2123-.087946-.4399-.133211-.6697-.133211z" fill="#b3b3b3" /></svg>
                                    </button>

                                    <div className="toggle-box">
                                        <button data-testid="edit-btn" onClick={() => displayEditForm(budget)}>Edit budget</button>
                                        <button data-testid="delete-btn" onClick={() => displayDeleteForm(budget)}>Delete budget</button>
                                    </div>

                                    <p>Maximum of<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                        {(budget.maximum / 100).toFixed(2)}
                                    </p>

                                    <div className="summary">
                                        {/* spending bar* */}
                                        <div className="spending-bar">
                                            <div style={{ backgroundColor: budget.theme, width: `${roundPercentage((Math.abs(budgetSpending[budget.category]) / budget.maximum) * 100)}%` }}></div>
                                        </div>

                                        <div className="spent">
                                            <div style={{ backgroundColor: budget.theme }}></div>
                                            <span>Spent</span>
                                            <span data-testid="detail-spending"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                                {(Math.abs(budgetSpending[budget.category]) / 100).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="remaining">
                                            <div></div>
                                            <span>Remaining</span>
                                            <span data-testid="detail-remaining"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                                {((budget.maximum - Math.abs(budgetSpending[budget.category])) / 100).toFixed(2)}
                                            </span>
                                        </div>

                                    </div>
                                </div>

                                {/* latest spending */}
                                <div className="latest-spending">
                                    <div>
                                        <h3>Latest Spending</h3>
                                        <Link to="/transactions">
                                            <span>See All</span>
                                            <svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg"><path d="m.853506.146465 5.000004 5.000005c.04648.04643.08336.10158.10853.16228.02516.06069.03811.12576.03811.19147 0 .0657-.01295.13077-.03811.19147-.02517.06069-.06205.11584-.10853.16228l-5.000004 5.00003c-.069927.07-.159054.1177-.256097.137-.097042.0193-.197637.0094-.289048-.0285-.091412-.0378-.16953-.102-.2244652-.1843-.0549354-.0823-.08421767-.179-.08413981-.278l-.00000043-9.999984c-.00007788-.098949.02920444-.195695.08413984-.277992.0549356-.082297.1330536-.1464431.2244646-.1843193.091412-.03787611.192007-.04777907.289049-.02845381.097042.01932521.186169.06700801.256097.13701411z" fill="#696868" /></svg>
                                        </Link>
                                    </div>
                                    <LatestSpending user={user} category={budget.category} />
                                </div>
                            </section>
                        )
                        }
                    </div>
                </div>
            }

            {/* if no budgets* */}
            {budgets.length === 0 &&
                <h2>Could not find any budgets for {user.user.username}</h2>
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