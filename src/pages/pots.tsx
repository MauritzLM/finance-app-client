import { useEffect, useState } from "react"
import { userObj, pot } from "../types"

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

    // show / hide state functions*

    useEffect(() => {
        if (!pots.length) {
            getPots()
        }
    }, [])

    return (
        <>
            <h1>Pots</h1>
            <button>+ Add New Pot</button>

            {/* pot detail list */}
            <div className="pots-container">
                {pots?.map(pot =>
                    <div key={pot.name} className="pot-card">
                        <div>
                            <h2>{pot.name}</h2>
                            {/* toggle button */}
                            <button></button>
                            <div>
                                <button>Edit Pot</button>
                                <button>Delete Pot</button>
                            </div>
                        </div>

                        <div>
                            <div>
                                <span>Total Saved</span><span>${pot.total}</span>
                            </div>
                            {/* add progress bar* */}
                            <div className="progress-bar"></div>
                            <div>
                                <span>{(pot.total / pot.target) * 100}%</span><span>Target of ${pot.target}</span>
                            </div>
                        </div>

                        <div>
                            <button>+ Add Money</button>
                            <button>Withdraw Money</button>
                        </div>
                    </div>
                )}

            </div>
            {/* new pot form* */}
            {showNewForm &&
                <div className="form_modal">

                </div>
            }
            {/* edit pot form* */}
            {showEditForm &&
                <div className="form_modal">

                </div>
            }

            {/* delete pot form* */}
            {showDeleteForm &&
                <div className="form_modal">

                </div>
            }

            {/* add form* */}
            {showAddForm &&
                <div className="form_modal">

                </div>
            }

            {/* withdraw form* */}
            {showWithdrawForm &&
                <div className="form_modal">

                </div>
            }
        </>
    )
}

export default Pots