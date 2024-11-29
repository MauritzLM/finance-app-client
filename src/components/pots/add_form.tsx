import { pot, userObj } from "../../types"

interface addFormProps {
    user: userObj,
    pot: pot,
    pots: pot[],
    updatePots: (potArr: pot[]) => void,
    hideAddForm: () => void
}

function AddForm({user, pot, pots, updatePots, hideAddForm }: addFormProps) {
    // state -> formData, formErrors*

    // handle submit function*
    return (
        <>
            <form>
                <h2>Add to '{pot.name}'</h2>
                 {/* form groups* (new amount, bar/numbers, amount to add) */}
                <button type="submit">Confirm Addition</button> 
            </form>
        </>
    )
}

export default AddForm