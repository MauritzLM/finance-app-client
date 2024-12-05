import { useState } from "react"
import { themeData } from "../../data/data"
import { unusedThemes } from "../../helpers/helpers"
import { pot, userObj, strObj } from "../../types"

interface newFormProps {
    user: userObj,
    pots: pot[],
    updatePots: (potArr: pot[]) => void,
    hideNewForm: () => void
}

function NewPotForm({ user, pots, updatePots, hideNewForm }: newFormProps) {
    const [formData, setFormData] = useState({ 'name': '', 'target': 0, 'theme': '', 'total': 0.00 })
    const [formErrors, setFormErrors] = useState({ 'name': '', 'target': '', 'theme': '' })

    // handle submit function
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const response = await fetch(`http://localhost:8000/finance-api/pots`, {
                method: 'POST',
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
            if (response.status === 201) {
                // close form & update budget with returned object
                const newBudgetArr = [...pots, data]

                // add new budget to budgets state
                updatePots(newBudgetArr)

                hideNewForm()
            }


        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form data-testid="new-form" onSubmit={(e) => handleSubmit(e)}>
                <h2>Add New Pot</h2>
                <button type="button" onClick={hideNewForm}>Close</button>
                <p>Create a pot to set savings targets. These can help keep you on track as you save for special purchases.</p>
                {/* form groups* (name, target, theme)*/}
                <div className="form-group">
                    {formErrors.name && <span className="error">{formErrors.name}</span>}
                    <label htmlFor="name">Pot Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onInput={(e) => setFormData({ ...formData, 'name': e.currentTarget.value })} />
                    <span>{30 - (formData.name.length)} characters left</span>
                </div>
                <div className="form-group">
                    {formErrors.target && <span className="error">{formErrors.target}</span>}
                    <label htmlFor="target">Target</label>
                    <input type="number" name="target" id="target" value={formData.target} onInput={(e) => setFormData({ ...formData, 'target': Number(e.currentTarget.value) })} />
                </div>
                <div className="form-group">
                    {formErrors.theme && <span className="error">{formErrors.theme}</span>}
                    <label htmlFor="theme">Theme</label>
                    <select name="theme" id="theme" onChange={(e) => setFormData({ ...formData, 'theme': e.currentTarget.value })}>
                        <option value="">Select a theme</option>
                        {Object.keys(themeData).map(t =>
                            <option key={t} value={themeData[t]}>{t}</option>
                        )}
                    </select>

                </div>
                <button type="submit">Add Pot</button>
            </form>
        </>
    )
}

export default NewPotForm