
import { userObj, budget, budgetForm } from "../../types";
import { categories } from "../../data/data";
import { useState } from "react";
import { unusedCategories } from "../../helpers/helpers";

interface newBudgetFormProps {
    user: userObj,
    budgets: budget[],
    hideNewForm: () => void
}

function NewBudgetForm({ user, budgets, hideNewForm }: newBudgetFormProps) {
    const [formData, setFormData] = useState<budgetForm>({ 'category': '', 'maximum': 20, 'theme': '' })
    const [formErrors, setFormErrors] = useState({ 'category': '', 'maximum': '', 'theme': '' })


    // submit function*
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            const response = await fetch('http://localhost:8000/finance-api/budgets', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            // if errors
            if (data.errors) {
                setFormErrors({...data.errors})
                return
            } 
       
            // close form & updatemade state*

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form>
                <button onClick={hideNewForm}>Close</button>
                <h2>Add New Budget</h2>
                <p>Choose a category to set a spending budget. These categories can help you monitor spending</p>

                <div className="form-group">
                    <label htmlFor="category">Budget Category</label>
                    <select name="category" id="category" onChange={(e) => setFormData({ ...formData, 'category': e.currentTarget.value })}>
                        {unusedCategories(categories, budgets).map(c =>
                            <option value={c}>{c}</option>
                        )}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="maximum">Maximum Spend</label>
                    <input type="number" name="maximum" id="maximum" min={20} value={formData.maximum} onInput={(e) => setFormData({ ...formData, 'maximum': Number(e.currentTarget.value) })}></input>
                </div>

                <div className="form-group">
                    <label htmlFor="theme">Theme</label>
                    <select name="theme" id="theme"></select>
                    {/* display unused themes as options* */}
                </div>
            </form>
        </>
    )
}

export default NewBudgetForm