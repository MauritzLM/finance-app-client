import { useEffect, useState } from "react"
import { userObj, pot } from "../types"
import NewPotForm from "../components/pots/new_pot_form"
import EditPotForm from "../components/pots/edit_pot_form"
import AddForm from "../components/pots/add_form"
import WithdrawForm from "../components/pots/withdraw_form"
import DeletePotForm from "../components/pots/delete_pot_form"
import { roundPercentage } from "../helpers/helpers"
import '../assets/sass/pots.scss'

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
    const [potToEdit, setPotToEdit] = useState<pot>({ 'name': '', 'total': 0, 'theme': '', 'id': 1, 'target': 0 })

    const [currentToggle, setCurrentToggle] = useState('')

    // fetch pots if not in state
    async function getPots() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/finance-api/pots`, {
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
        setCurrentToggle('')
        // hide other forms
    }

    function displayDeleteForm(p: pot) {
        setPotToEdit(p)
        setShowDeleteform(true)
        setCurrentToggle('')
    }

    function displayAddForm(p: pot) {
        setPotToEdit(p)
        setShowAddForm(true)
        setCurrentToggle('')
    }

    function displayWithdrawForm(p: pot) {
        setPotToEdit(p)
        setShowWithdrawForm(true)
        setCurrentToggle('')
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

    // edit / delete toggle
    function handleToggle(potName: string) {
        if (currentToggle === potName) {
            setCurrentToggle('')
        }

        else {
            setCurrentToggle(potName)
        }
    }

    useEffect(() => {
        if (!pots.length) {
            getPots()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <section className="header">
                <h1>Pots</h1>
                <button className="new-btn" data-testid="new-btn" onClick={() => setShowNewForm(true)}>+ Add New Pot</button>
            </section>

            {/* pot detail list */}
            <div className="pots-container">
                {pots?.map(pot =>
                    <section data-testid="pot-item" key={pot.name} className="pot-card">
                        <div>
                            <div className="heading">
                                <div style={{ backgroundColor: pot.theme }}></div>
                                <h2>{pot.name}</h2>
                            </div>

                            {/* toggle button */}
                            <button className={currentToggle === pot.name ? 'toggle-btn cs-active' : 'toggle-btn'} onClick={() => handleToggle(pot.name)}>
                                <svg fill="none" height="4" viewBox="0 0 14 4" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m8.75 2c0 .34612-.10264.68446-.29493.97225-.19229.28778-.4656.51209-.78537.64454s-.67164.16711-1.01111.09958c-.33946-.06752-.65128-.23419-.89603-.47893-.24474-.24474-.41141-.55657-.47893-.89603-.06753-.33947-.03287-.69134.09958-1.01111.13246-.31977.35676-.593079.64454-.785372.28779-.192292.62613-.294928.97225-.294928.46413 0 .90925.184375 1.23744.512563.32819.328187.51256.773307.51256 1.237437zm-6.75-1.75c-.34612 0-.68446.102636-.97225.294928-.287783.192293-.512085.465602-.644538.785372-.132454.31977-.16711.67164-.099585 1.01111.067524.33946.234195.65129.478937.89603.244746.24474.556566.41141.896026.47893.33947.06753.69134.03287 1.01111-.09958s.59308-.35676.78537-.64454c.1923-.28779.29493-.62613.29493-.97225 0-.46413-.18437-.90925-.51256-1.237437-.32819-.328188-.77331-.512563-1.23744-.512563zm10 0c-.3461 0-.6845.102636-.9722.294928-.2878.192293-.5121.465602-.6446.785372-.1324.31977-.1671.67164-.0996 1.01111.0676.33946.2342.65129.479.89603.2447.24474.5565.41141.896.47893.3395.06753.6913.03287 1.0111-.09958s.5931-.35676.7854-.64454c.1923-.28779.2949-.62613.2949-.97225 0-.22981-.0453-.45738-.1332-.6697-.088-.21232-.2169-.405234-.3794-.567737-.1625-.162502-.3554-.291407-.5677-.379352-.2123-.087946-.4399-.133211-.6697-.133211z" fill="#b3b3b3" /></svg>
                            </button>
                            <div className="toggle-box">
                                <button data-testid="edit-btn" onClick={() => displayEditForm(pot)}>Edit Pot</button>
                                <button data-testid="delete-btn" onClick={() => displayDeleteForm(pot)}>Delete Pot</button>
                            </div>
                        </div>

                        <div className="pot-details">
                            <div className="total">
                                <span>Total Saved</span><span data-testid="pot-total">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                    {(pot.total / 100).toFixed(2)}
                                </span>
                            </div>
                            {/* progress bar */}
                            <div className="progress-bar">
                                <div style={{ backgroundColor: pot.theme, width: `${roundPercentage((pot.total / pot.target) * 100)}%` }}></div>
                            </div>
                            <div className="percentage">
                                <span data-testid="pot-percentage">{roundPercentage((pot.total / pot.target) * 100)}%</span><span data-testid="pot-target">Target of<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                    {pot.target / 100}</span>
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button data-testid="add-btn" onClick={() => displayAddForm(pot)}>+ Add Money</button>
                            <button data-testid="withdraw-btn" onClick={() => displayWithdrawForm(pot)}>Withdraw</button>
                        </div>
                    </section>
                )}

                {/* if no pots* */}
                {pots.length === 0 &&
                    <h2>Could not find any pots for {user.user.username}</h2>
                }

            </div>
            {/* new pot form* */}
            {showNewForm &&
                <div className="form-modal">
                    <NewPotForm user={user} pots={pots} updatePots={updatePots} hideNewForm={hideNewForm} />
                </div>
            }
            {/* edit pot form* */}
            {showEditForm &&
                <div className="form-modal">
                    <EditPotForm user={user} pot={potToEdit} pots={pots} updatePots={updatePots} hideEditForm={hideEditForm} />
                </div>
            }

            {/* delete pot form* */}
            {showDeleteForm &&
                <div className="form-modal">
                    <DeletePotForm user={user} pot={potToEdit} pots={pots} updatePots={updatePots} hideDeleteForm={hideDeleteForm} />
                </div>
            }

            {/* add form* */}
            {showAddForm &&
                <div className="form-modal">
                    <AddForm user={user} pot={potToEdit} pots={pots} updatePots={updatePots} hideAddForm={hideAddForm} />
                </div>
            }

            {/* withdraw form* */}
            {showWithdrawForm &&
                <div className="form-modal">
                    <WithdrawForm user={user} pot={potToEdit} pots={pots} updatePots={updatePots} hideWithdrawForm={hideWithdrawForm} />
                </div>
            }
        </>
    )
}

export default Pots