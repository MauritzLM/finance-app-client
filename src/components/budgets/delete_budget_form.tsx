import { budget, userObj } from "../../types"


interface deleteFormProps {
    user: userObj,
    budget: budget,
    budgets: budget[],
    updateBudgets: (budgetArr: budget[]) => void,
    hideDeleteForm: () => void
}

function DeleteBudgetForm({ user, budget, budgets, updateBudgets, hideDeleteForm }: deleteFormProps) {
    // state -> formErrors* 

    // handle submit
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()
            const response = await fetch(`http://localhost:8000/finance-api/budgets/${budget.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                }
            })

            const data = await response.json()
            console.log(data)

            // 401 - unauthorized*
            
            // success
            if (response.status === 200) {
                const newArr: budget[] = budgets.filter(item => item.id !== budget.id)

                updateBudgets(newArr)
                hideDeleteForm()
            }

            // errors / response 400*



        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form data-testid="delete-form" onSubmit={(e) => handleSubmit(e)}>
                <button type="button" onClick={hideDeleteForm}>close</button>
                <h2>Delete '{budget.category}'?</h2>
                <p>Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.</p>

                <button type="submit">Yes, Confirm Deletion</button>
                <button type="button" onClick={hideDeleteForm}>No, Go Back</button>
            </form>
        </>
    )
}

export default DeleteBudgetForm