import { useState } from "react"
import { pot, userObj, strObj } from "../../types"
import { roundPercentage } from "../../helpers/helpers"

interface addFormProps {
    user: userObj,
    pot: pot,
    pots: pot[],
    updatePots: (potArr: pot[]) => void,
    hideAddForm: () => void
}

function AddForm({ user, pot, pots, updatePots, hideAddForm }: addFormProps) {
    const [formData, setFormData] = useState({ 'amount': 0 })
    const [formErrors, setFormErrors] = useState({ 'amount': '' })

    // handle submit function
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const response = await fetch(`http://localhost:8000/finance-api/pots/add/${pot.id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            // if errors
            if (response.status === 400) {
                const dataArr = Object.keys(data)

                const errorsObj: strObj = {}

                dataArr.forEach(key => errorsObj[key] = data[key].join())

                setFormErrors({ ...formErrors, ...errorsObj })
                return
            }

            // success
            if (response.status === 200) {
                // remove object and replace with updated object
                const filteredArr: pot[] = pots.filter(item => item.id !== pot.id)

                const newArr: pot[] = [...filteredArr, { ...data }]
                updatePots(newArr)
                hideAddForm()

                return
            }

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <form data-testid="add-form" onSubmit={(e) => handleSubmit(e)}>
                <h2>Add to '{pot.name}'</h2>
                <button type="button" onClick={hideAddForm}>close</button>
                {/* form groups (new amount, bar/numbers, amount to add) */}
                <div><span>New Amount</span> <span data-testid="new-amount">${(formData.amount + pot.total).toFixed(2)}</span></div>
                {/* bar */}
                <div className="progress-bar">
                    <div className="initial-value" style={{ width: `${roundPercentage((pot.total / pot.target) * 100)}%` }}></div>
                    <div className="new-value" style={{ width: `${roundPercentage(((formData.amount + pot.total) / pot.target) * 100)}%` }}></div>
                </div>
                <div><span data-testid="percentage">{roundPercentage(((formData.amount + pot.total) / pot.target) * 100)}%</span> <span data-testid="target">Target of ${pot.target}</span></div>
                <div className="form-group">
                    {formErrors.amount && <span className="error">{formErrors.amount}</span>}
                    <label htmlFor="amount">Amount to Add</label>
                    <input type="number" name="amount" id="amount" min={10} max={pot.target - pot.total} value={formData.amount} onInput={(e) => setFormData({ ...formData, 'amount': Number(e.currentTarget.value) })} />
                </div>
                <button type="submit">Confirm Addition</button>
            </form>
        </>
    )
}

export default AddForm