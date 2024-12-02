import { pot, userObj } from "../../types";

interface deleteFormProps {
    user: userObj,
    pot: pot,
    pots: pot[],
    updatePots: (potArr: pot[]) => void,
    hideDeleteForm: () => void
}

function DeletePotForm({ user, pot, pots, updatePots, hideDeleteForm }: deleteFormProps) {
    // state -> formErrors*s

    // handle submit function*
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const response = await fetch(`http://localhost:8000/finance-api/pots/${pot.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                }
            })

            const data = await response.json()

            console.log(data)

            // success
            if (response.status === 200) {
                const newArr: pot[] = pots.filter(item => item.id !== pot.id)

                updatePots(newArr)
                hideDeleteForm()
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)}>
                <h2>Delete '{pot.name}'?</h2>
                <button type="button" onClick={hideDeleteForm}>close</button>
                <p>Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.</p>

                <button type="submit">Yes, Confirm Deletion</button>
                <button type="button">No, Go Back</button>
            </form>
        </>
    )
}

export default DeletePotForm