import { pot, userObj } from "../../types"

interface newFormProps {
    user: userObj,
    pots: pot[],
    updatePots: (potArr: pot[]) => void,
    hideNewForm: () => void
}

function NewPotForm({ user, pots, updatePots, hideNewForm }: newFormProps) {
    // state -> formData, formErrors*

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

export default NewPotForm