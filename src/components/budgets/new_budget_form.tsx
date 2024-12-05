
import { userObj, budget, budgetForm, strObj } from "../../types";
import { categories, themeData } from "../../data/data";
import { useState } from "react";
import { unusedCategories, unusedThemes } from "../../helpers/helpers";

interface newBudgetFormProps {
    user: userObj,
    budgets: budget[],
    hideNewForm: () => void,
    updateBudgets: (budgetsArr: budget[]) => void,
    updateNewBudget: (name: string) => void
}

function NewBudgetForm({ user, budgets, hideNewForm, updateBudgets, updateNewBudget }: newBudgetFormProps) {
    const [formData, setFormData] = useState<budgetForm>({ 'category': '', 'maximum': 20, 'theme': '' })
    const [formErrors, setFormErrors] = useState({ 'category': '', 'maximum': '', 'theme': '' })


    // submit function
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const response = await fetch('http://localhost:8000/finance-api/budgets', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            console.log(data)

            // 401 - unauthorized*

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
                const newBudgetArr = [...budgets, data]

                // add new budget to budgets state
                updateBudgets(newBudgetArr)
                // update state to new budget category
                updateNewBudget(formData.category)

                hideNewForm()
            }


        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form data-testid="new-form" onSubmit={(e) => handleSubmit(e)}>
                <button onClick={hideNewForm}>Close</button>
                <h2>Add New Budget</h2>
                <p>Choose a category to set a spending budget. These categories can help you monitor spending</p>

                <div className="form-group">
                    {formErrors.category && <span className="error">{formErrors.category}</span>}
                    <label htmlFor="category">Budget Category</label>
                    <select name="category" id="category" onChange={(e) => setFormData({ ...formData, 'category': e.currentTarget.value })}>
                        <option value=''>Select a category</option>
                        {unusedCategories(categories, budgets).map((c, i) =>
                            <option key={`${c}-${i}`} value={c}>{c}</option>
                        )}
                    </select>
                </div>

                <div className="form-group">
                    {formErrors.maximum && <span className="error">{formErrors.maximum}</span>}
                    <label htmlFor="maximum">Maximum Spend</label>
                    <input type="number" name="maximum" id="maximum" value={formData.maximum} onInput={(e) => setFormData({ ...formData, 'maximum': Number(e.currentTarget.value) })}></input>
                </div>

                <div className="form-group">
                    {formErrors.theme && <span className="error">{formErrors.theme}</span>}
                    <label htmlFor="theme">Theme</label>
                    <select name="theme" id="theme" onChange={(e) => setFormData({ ...formData, 'theme': e.currentTarget.value })}>
                        <option value="">Select a Theme</option>
                        {Object.keys(themeData).map(t =>
                            <option key={t} value={themeData[t]}>{t}</option>
                        )}
                    </select>
                </div>

                <button type="submit">Add Budget</button>
            </form>
        </>
    )
}

export default NewBudgetForm