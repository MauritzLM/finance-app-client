import { useState } from "react"
import { pot, userObj, strObj } from "../../types"
import { themeData } from "../../data/data"

interface editFormProps {
    user: userObj,
    pot: pot,
    pots: pot[],
    updatePots: (potArr: pot[]) => void,
    hideEditForm: () => void
}

function EditPotForm({ user, pot, pots, updatePots, hideEditForm }: editFormProps) {
    const [formData, setFormData] = useState({ 'name': pot.name, 'target': pot.target, 'theme': pot.theme })
    const [formErrors, setFormErrors] = useState({ 'name': '', 'target': '', 'theme': '' })

    // handle submit function
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const response = await fetch(`http://localhost:8000/finance-api/pots/${pot.id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            console.log(data)

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
                hideEditForm()

                return
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)}>
                <h2>Edit Pot</h2>
                <button type="button" onClick={hideEditForm}>Close</button>
                <p>If your saving targets change, feel free to update your pots.</p>
                {/* form groups (name, target, theme) */}
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
                    <select name="theme" id="theme" value={formData.theme} onChange={(e) => setFormData({ ...formData, 'theme': e.currentTarget.value })}>
                        <option value="">Select a theme</option>
                        {Object.keys(themeData).map(t =>
                            <option key={t} value={themeData[t]}>{t}</option>
                        )}
                    </select>

                </div>
                <button type="submit">Save Changes</button>
            </form>
        </>
    )
}

export default EditPotForm