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
    return (
        <>
            <form>
                <h2>Delete '{pot.name}'?</h2>
                <p>Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.</p>

                <button type="submit">Yes, Confirm Deletion</button>
                <button type="button">No, Go Back</button>
            </form>
        </>
    )
}

export default DeletePotForm