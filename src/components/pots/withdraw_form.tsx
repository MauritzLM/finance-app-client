import { pot, userObj } from "../../types"

interface withdrawFormProps {
    user: userObj,
    pot: pot,
    pots: pot[],
    updatePots: (potArr: pot[]) => void,
    hideWithdrawForm: () => void
}

function AddForm({ user, pot, pots, updatePots, hideWithdrawForm }: withdrawFormProps) {
    // state -> formData, formErrors*

    // handle submit function*
    return (
        <>
            <form>
                <h2>Withdraw from '{pot.name}'</h2>
                {/* form groups* (new amount, bar/numbers, amount to withdraw) */}
                <button type="submit">Confirm Withdrawal</button>
            </form>
        </>
    )
}

export default AddForm