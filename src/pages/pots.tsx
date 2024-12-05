import { useEffect, useState } from "react"
import { userObj, pot } from "../types"
import NewPotForm from "../components/pots/new_pot_form"
import EditPotForm from "../components/pots/edit_pot_form"
import AddForm from "../components/pots/add_form"
import WithdrawForm from "../components/pots/withdraw_form"
import DeletePotForm from "../components/pots/delete_pot_form"
import { roundPercentage } from "../helpers/helpers"

interface potsProps {
    user: userObj,
    pots: pot[],
    updatePots: (potArr: pot[]) => void
}

function Pots({ user, pots, updatePots }: potsProps) {
    const [showNewForm, setShowNewForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showDeleteForm, setShowDeleteform] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showWithdrawForm, setShowWithdrawForm] = useState(false)
    const [potToEdit, setPotToEdit] = useState<pot>({})

    // fetch pots if not in state
    async function getPots() {
        try {
            const response = await fetch('http://localhost:8000/finance-api/pots', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data = await response.json()

            updatePots(data)

            // 401 status -> change auth status*

        } catch (error) {
            console.log(error)
        }
    }

    // forms -> new, edit, delete / add, withdraw*
    function displayEditForm(p: pot) {
        setPotToEdit(p)
        setShowEditForm(true)
        // hide other forms
    }

    function displayDeleteForm(p: pot) {
        setPotToEdit(p)
        setShowDeleteform(true)
    }

    function displayAddForm(p: pot) {
        setPotToEdit(p)
        setShowAddForm(true)
    }

    function displayWithdrawForm(p: pot) {
        setPotToEdit(p)
        setShowWithdrawForm(true)
    }

    // show / hide state functions
    function hideNewForm() {
        setShowNewForm(false)
    }

    function hideEditForm() {
        setShowEditForm(false)
    }

    function hideDeleteForm() {
        setShowDeleteform(false)
    }

    function hideAddForm() {
        setShowAddForm(false)
    }

    function hideWithdrawForm() {
        setShowWithdrawForm(false)
    }

    useEffect(() => {
        if (!pots.length) {
            getPots()
        }
    }, [])

    return (
        <>
            <h1>Pots</h1>
            <button data-testid="new-btn" onClick={() => setShowNewForm(true)}>+ Add New Pot</button>

            {/* pot detail list */}
            <div className="pots-container">
                {pots?.map(pot =>
                    <div data-testid="pot-item" key={pot.name} className="pot-card">
                        <div>
                            <div>
                                <div style={{ backgroundColor: pot.theme }}></div>
                                <h2>{pot.name}</h2>
                            </div>

                            {/* toggle button */}
                            <button></button>
                            <div>
                                <button data-testid="edit-btn" onClick={() => displayEditForm(pot)}>Edit Pot</button>
                                <button data-testid="delete-btn" onClick={() => displayDeleteForm(pot)}>Delete Pot</button>
                            </div>
                        </div>

                        <div>
                            <div>
                                <span>Total Saved</span><span data-testid="pot-total">${pot.total.toFixed(2)}</span>
                            </div>
                            {/* progress bar */}
                            <div className="progress-bar">
                                <div style={{ backgroundColor: pot.theme, width: `${roundPercentage((pot.total / pot.target) * 100)}%` }}></div>
                            </div>
                            <div>
                                <span data-testid="pot-percentage">{roundPercentage((pot.total / pot.target) * 100)}%</span><span data-testid="pot-target">Target of ${pot.target}</span>
                            </div>
                        </div>

                        <div>
                            <button data-testid="add-btn" onClick={() => displayAddForm(pot)}>+ Add Money</button>
                            <button data-testid="withdraw-btn" onClick={() => displayWithdrawForm(pot)}>Withdraw Money</button>
                        </div>
                    </div>
                )}

            </div>
            {/* new pot form* */}
            {showNewForm &&
                <div className="form_modal">
                    <NewPotForm user={user} pots={pots} updatePots={updatePots} hideNewForm={hideNewForm} />
                </div>
            }
            {/* edit pot form* */}
            {showEditForm &&
                <div className="form_modal">
                    <EditPotForm user={user} pot={potToEdit} pots={pots} updatePots={updatePots} hideEditForm={hideEditForm} />
                </div>
            }

            {/* delete pot form* */}
            {showDeleteForm &&
                <div className="form_modal">
                    <DeletePotForm user={user} pot={potToEdit} pots={pots} updatePots={updatePots} hideDeleteForm={hideDeleteForm} />
                </div>
            }

            {/* add form* */}
            {showAddForm &&
                <div className="form_modal">
                    <AddForm user={user} pot={potToEdit} pots={pots} updatePots={updatePots} hideAddForm={hideAddForm} />
                </div>
            }

            {/* withdraw form* */}
            {showWithdrawForm &&
                <div className="form_modal">
                    <WithdrawForm user={user} pot={potToEdit} pots={pots} updatePots={updatePots} hideWithdrawForm={hideWithdrawForm} />
                </div>
            }
        </>
    )
}

export default Pots