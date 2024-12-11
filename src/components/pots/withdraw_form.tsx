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
                <button type="button" onClick={hideWithdrawForm}>
                    <svg fill="none" height="26" viewBox="0 0 26 26" width="26" xmlns="http://www.w3.org/2000/svg"><path d="m17.53 9.53-3.47 3.47 3.47 3.47c.0737.0687.1328.1515.1738.2435s.063.1913.0648.292-.0168.2007-.0545.2941-.0938.1782-.1651.2494c-.0712.0713-.156.1274-.2494.1651s-.1934.0563-.2941.0545-.2-.0238-.292-.0648-.1748-.1001-.2435-.1738l-3.47-3.47-3.47 3.47c-.14217.1325-.33022.2046-.52452.2012-.1943-.0035-.37968-.0822-.5171-.2196-.13741-.1374-.21612-.3228-.21955-.5171s.0687-.3823.20118-.5245l3.46999-3.47-3.46999-3.47c-.13248-.14218-.20461-.33022-.20118-.52452s.08214-.37969.21955-.5171c.13742-.13741.3228-.21613.5171-.21956.1943-.00342.38235.0687.52452.20118l3.47 3.47 3.47-3.47c.1422-.13248.3302-.2046.5245-.20118.1943.00343.3797.08215.5171.21956s.2162.3228.2196.5171-.0687.38234-.2012.52452zm8.22 3.47c0 2.5217-.7478 4.9868-2.1488 7.0835-1.4009 2.0967-3.3922 3.7309-5.722 4.696-2.3297.965-4.8933 1.2175-7.3666.7255-2.47325-.4919-4.74509-1.7063-6.52821-3.4894s-2.997435-4.0549-3.489397-6.5282c-.49196108-2.4733-.239469-5.0369.725547-7.36661.96502-2.32976 2.59922-4.32104 4.69594-5.72203 2.09673-1.400986 4.56182-2.14876 7.08352-2.14876 3.3803.00397 6.621 1.34854 9.0112 3.73877 2.3903 2.39023 3.7348 5.63094 3.7388 9.01123zm-1.5 0c0-2.225-.6598-4.40011-1.896-6.25017-1.2361-1.85005-2.9931-3.29199-5.0488-4.14348-2.0557-.85148-4.3177-1.07427-6.5-.64018-2.18225.43408-4.18681 1.50554-5.76015 3.07888s-2.6448 3.5779-3.07888 5.76015c-.43408 2.1823-.2113 4.4443.64019 6.5s2.29343 3.8127 4.14348 5.0488c1.85005 1.2362 4.02516 1.896 6.25016 1.896 2.9827-.0033 5.8422-1.1896 7.9513-3.2987s3.2954-4.9686 3.2987-7.9513z" fill="#696868" /></svg>
                </button>
                {/* form groups (new amount, bar/numbers, amount to withdraw) */}
                <div><span>New Amount</span> <span data-testid="new-amount">${((pot.total / 100) - formData.amount).toFixed(2)}</span></div>
                {/* bar* */}

                <div className="progress-bar">
                    <div className="initial-value" style={{ width: `${roundPercentage((pot.total / pot.target) * 100)}%` }}></div>
                    <div className="new-value" style={{ width: `${roundPercentage((((pot.total / 100) - formData.amount) / (pot.target / 100)) * 100)}%` }}></div>
                </div>

                <div><span data-testid="percentage">{roundPercentage((((pot.total / 100) - formData.amount) / (pot.target / 100)) * 100)}%</span> <span data-testid="target">Target of ${pot.target / 100}</span></div>
                <div className="form-group">
                    {formErrors.amount && <span className="error">{formErrors.amount}</span>}
                    <label htmlFor="amount">Amount to Withdraw</label>
                    <input type="number" name="amount" id="amount" min={10} max={pot.total / 100} value={formData.amount} onInput={(e) => setFormData({ ...formData, 'amount': Number(e.currentTarget.value) })} />
                </div>
                <button type="submit">Confirm Withdrawal</button>
            </form>
        </>
    )
}

export default WithdrawForm