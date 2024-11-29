import { pot, userObj } from "../../types"

interface editFormProps {
    user: userObj,
    pot: pot,
    pots: pot[],
    updatePots: (potArr: pot[]) => void,
    hideEditForm: () => void
}

function EditPotForm({ user, pot, pots, updatePots, hideEditForm }: editFormProps) {

    // handle submit function*

    return (
        <>
            <form>
                <h2>Edit Pot</h2>
                <p>If your saving targets change, feel free to update your pots.</p>
                {/* form groups* (name, target, theme)*/}
                <button type="submit">Save Changes</button>
            </form>
        </>
    )
}

export default EditPotForm