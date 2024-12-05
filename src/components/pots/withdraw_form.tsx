import { pot, userObj, strObj } from "../../types"
import { useState } from "react"
import { roundPercentage } from "../../helpers/helpers"

interface withdrawFormProps {
    user: userObj,
    pot: pot,
    pots: pot[],
    updatePots: (potArr: pot[]) => void,
    hideWithdrawForm: () => void
}

function WithdrawForm({ user, pot, pots, updatePots, hideWithdrawForm }: withdrawFormProps) {
    const [formData, setFormData] = useState({ 'amount': 0 })
    const [formErrors, setFormErrors] = useState({ 'amount': '' })

    // handle submit function*
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const response = await fetch(`http://localhost:8000/finance-api/pots/withdraw/${pot.id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            // if errors
            if (response.status === 400) {
                const dataArr = Object.keys(data)

                const errorsObj: strObj = {}

                dataArr.forEach(key => errorsObj[key] = data[key].join())

                setFormErrors({ ...formErrors, ...errorsObj })
                return
            }

            // success
            if (response.status === 200) {
                // remove object and replace with updated object
                const filteredArr: pot[] = pots.filter(item => item.id !== pot.id)

                const newArr: pot[] = [...filteredArr, { ...data }]
                updatePots(newArr)
                hideWithdrawForm()

                return
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form data-testid="withdraw-form" onSubmit={(e) => handleSubmit(e)}>
                <h2>Withdraw from '{pot.name}'</h2>
                <button type="button" onClick={hideWithdrawForm}>close</button>
                {/* form groups (new amount, bar/numbers, amount to withdraw) */}
                <div><span>New Amount</span> <span>{pot.total - formData.amount}</span></div>
                {/* bar* */}
                <div></div>
                <div><span>{roundPercentage(((pot.total - formData.amount) / pot.target) * 100)}%</span> <span>Target of {pot.target}</span></div>
                <div className="form-group">
                    {formErrors.amount && <span className="error">{formErrors.amount}</span>}
                    <label htmlFor="amount">Amount to Withdraw</label>
                    <input type="number" name="amount" id="amount" min={10} max={pot.target - pot.total} value={formData.amount} onInput={(e) => setFormData({ ...formData, 'amount': Number(e.currentTarget.value) })} />
                </div>
                <button type="submit">Confirm Withdrawal</button>
            </form>
        </>
    )
}

export default WithdrawForm