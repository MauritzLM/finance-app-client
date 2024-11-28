import { useState } from "react"
import { unusedCategories } from "../../helpers/helpers"
import { themeData, categories } from "../../data/data"
import { budget, userObj, budgetForm, strObj } from "../../types"

interface editFormProps {
    user: userObj,
    budget: budget,
    budgets: budget[],
    hideEditForm: () => void,
    updateBudgets: (budgetArr: budget[]) => void
}

function EditBudgetForm({ user, budget, budgets, hideEditForm, updateBudgets }: editFormProps) {
    const [formData, setFormData] = useState<budgetForm>({ 'category': budget.category, 'maximum': budget.maximum, 'theme': budget.theme })
    const [formErrors, setFormErrors] = useState({ 'category': '', 'maximum': '', 'theme': '' })

    // submit function
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const response = await fetch(`http://localhost:8000/finance-api/budgets/${budget.id}`, {
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

            if (response.status === 200) {
                // remove object and replace with updated object
                const filteredArr: budget[] = budgets.filter(item => item.id !== budget.id)

                const newArr: budget[] = [...filteredArr, { ...data }]
                updateBudgets(newArr)
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
                <button type="button" onClick={hideEditForm}>Close</button>
                <h2>Edit Budget</h2>
                <p>As your budgets change, feel free to update your spending limits.</p>

                {/* category */}
                <div className="form-group">
                    {formErrors.category && <span className="error">{formErrors.category}</span>}
                    <label htmlFor="category">Budget Category</label>
                    <select name="category" id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, 'category': e.currentTarget.value })}>
                        <option value={budget.category}>{budget.category}</option>
                        {unusedCategories(categories, budgets).map((c, i) =>
                            <option key={`${c}-${i}`} value={c}>{c}</option>
                        )}
                    </select>
                </div>

                {/* maximum */}
                <div className="form-group">
                    {formErrors.maximum && <span className="error">{formErrors.maximum}</span>}
                    <label htmlFor="maximum">Maximum Spend</label>
                    <input type="number" name="maximum" id="maximum" value={formData.maximum} onInput={(e) => setFormData({ ...formData, 'maximum': Number(e.currentTarget.value) })}></input>
                </div>

                {/* theme */}
                <div className="form-group">
                    {formErrors.theme && <span className="error">{formErrors.theme}</span>}
                    <label htmlFor="theme">Theme</label>
                    <select name="theme" id="theme" value={formData.theme} onChange={(e) => setFormData({ ...formData, 'theme': e.currentTarget.value })}>
                        {Object.keys(themeData).map(t =>
                            <option key={t} value={themeData[t]}>{t}</option>
                        )}
                    </select>
                </div>

                <button type="submit">Save changes</button>
            </form>
        </>
    )
}

export default EditBudgetForm