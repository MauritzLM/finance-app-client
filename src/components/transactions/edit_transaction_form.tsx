import { useState } from "react"
import { userObj, strObj, transaction } from "../../types"
import { categories } from "../../data/data"

// props -> hide form, update recurring bills
interface editFormProps {
    user: userObj,
    selected_transaction: transaction,
    recurringBills: transaction[],
    updateRecurringBills: (transactionArr: transaction[]) => void
    hideEditForm: () => void
    toggleDelete: (t: transaction) => void
}

const initialFormErrors = { 'avatar': '', 'name': '', 'category': '', 'date': '', 'amount': '' }

export default function EditTransactionForm({ user, selected_transaction, recurringBills, updateRecurringBills, hideEditForm, toggleDelete }: editFormProps) {
    // controlled inputs*
    const [formData, setFormData] = useState({
        'avatar': selected_transaction.avatar, 'name': selected_transaction.name,
        'category': selected_transaction.category, 'date': selected_transaction.date.split('T')[0], 'amount': selected_transaction.amount, 'recurring': selected_transaction.recurring
    })
    const [formErrors, setFormErrors] = useState({ 'avatar': '', 'name': '', 'category': '', 'date': '', 'amount': '' })

    // submit function
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const response = await fetch(`${import.meta.env.VITE_API_URL}/finance-api/transactions/${selected_transaction.id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            console.log(data)

            // if errors
            if (response.status === 400) {
                const dataArr = Object.keys(data)

                const errorsObj: strObj = {}

                dataArr.forEach(key => errorsObj[key] = data[key].join())

                // data error message*

                setFormErrors({ ...initialFormErrors, ...errorsObj })
                return
            }

            // success
            if (response.status === 201) {

                // update recurring bills
                if (data.recurring && data.amount < 0) {
                    updateRecurringBills([...recurringBills, data])
                }

                // update transactions*

                // close form
                hideEditForm()
            }

        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <form data-testid="edit-form" className="cs-form" action="" onSubmit={(e) => handleSubmit(e)}>
            <h2>Edit Transaction</h2>
            <button data-testid="close-btn" className="close-btn" type="button" onClick={hideEditForm}>
                <svg fill="none" height="26" viewBox="0 0 26 26" width="26" xmlns="http://www.w3.org/2000/svg"><path d="m17.53 9.53-3.47 3.47 3.47 3.47c.0737.0687.1328.1515.1738.2435s.063.1913.0648.292-.0168.2007-.0545.2941-.0938.1782-.1651.2494c-.0712.0713-.156.1274-.2494.1651s-.1934.0563-.2941.0545-.2-.0238-.292-.0648-.1748-.1001-.2435-.1738l-3.47-3.47-3.47 3.47c-.14217.1325-.33022.2046-.52452.2012-.1943-.0035-.37968-.0822-.5171-.2196-.13741-.1374-.21612-.3228-.21955-.5171s.0687-.3823.20118-.5245l3.46999-3.47-3.46999-3.47c-.13248-.14218-.20461-.33022-.20118-.52452s.08214-.37969.21955-.5171c.13742-.13741.3228-.21613.5171-.21956.1943-.00342.38235.0687.52452.20118l3.47 3.47 3.47-3.47c.1422-.13248.3302-.2046.5245-.20118.1943.00343.3797.08215.5171.21956s.2162.3228.2196.5171-.0687.38234-.2012.52452zm8.22 3.47c0 2.5217-.7478 4.9868-2.1488 7.0835-1.4009 2.0967-3.3922 3.7309-5.722 4.696-2.3297.965-4.8933 1.2175-7.3666.7255-2.47325-.4919-4.74509-1.7063-6.52821-3.4894s-2.997435-4.0549-3.489397-6.5282c-.49196108-2.4733-.239469-5.0369.725547-7.36661.96502-2.32976 2.59922-4.32104 4.69594-5.72203 2.09673-1.400986 4.56182-2.14876 7.08352-2.14876 3.3803.00397 6.621 1.34854 9.0112 3.73877 2.3903 2.39023 3.7348 5.63094 3.7388 9.01123zm-1.5 0c0-2.225-.6598-4.40011-1.896-6.25017-1.2361-1.85005-2.9931-3.29199-5.0488-4.14348-2.0557-.85148-4.3177-1.07427-6.5-.64018-2.18225.43408-4.18681 1.50554-5.76015 3.07888s-2.6448 3.5779-3.07888 5.76015c-.43408 2.1823-.2113 4.4443.64019 6.5s2.29343 3.8127 4.14348 5.0488c1.85005 1.2362 4.02516 1.896 6.25016 1.896 2.9827-.0033 5.8422-1.1896 7.9513-3.2987s3.2954-4.9686 3.2987-7.9513z" fill="#696868" /></svg>
            </button>

            {/* avatar */}
            <div className="form-group">
                {formErrors.avatar && <span className="error">{formErrors.avatar}</span>}
                <label htmlFor="avatar">Avatar</label>
                <div>
                    <svg fill="none" height="6" viewBox="0 0 12 6" width="12" xmlns="http://www.w3.org/2000/svg"><path d="m11.3538.85375-5.00002 5c-.04644.04649-.10158.08337-.16228.10853s-.12576.03811-.19147.03811-.13077-.01295-.19147-.03811-.11585-.06204-.16228-.10853l-5.000002-5c-.070006-.069927-.11769-.159054-.137015-.256096-.019325-.097043-.009423-.197638.028453-.289049.037877-.091412.102024-.16953.18432-.224465.082297-.0549354.179044-.08421771.277994-.08413985h9.99997c.099-.00007786.1957.02920445.278.08413985.0823.054935.1465.133053.1843.224465.0379.091411.0478.192006.0285.289049-.0193.097042-.067.186169-.137.256096z" fill="#201f24" /></svg>
                    <select data-testid="form-input" name="avatar" id="avatar" value={formData.avatar} onChange={(e) => setFormData({ ...formData, 'avatar': e.currentTarget.value })}>
                        <option value={formData.avatar}>{formData.avatar.split('/')[3]}</option>
                    </select>
                </div>
            </div>

            {/* name */}
            <div className="form-group">
                {formErrors.name && <span className="error">{formErrors.name}</span>}
                <label htmlFor="name">Transaction Name</label>
                <input data-testid="form-input" type="text" name="name" id="name" value={formData.name} onInput={(e) => setFormData({ ...formData, 'name': e.currentTarget.value })} />
                {/* <span>{30 - (formData.name.length)} characters left</span> */}
            </div>

            {/* category -> select */}
            <div className="form-group">
                {formErrors.category && <span data-testid="error" className="error">{formErrors.category}</span>}
                <label htmlFor="category">Transaction Category</label>
                <div>
                    <svg fill="none" height="6" viewBox="0 0 12 6" width="12" xmlns="http://www.w3.org/2000/svg"><path d="m11.3538.85375-5.00002 5c-.04644.04649-.10158.08337-.16228.10853s-.12576.03811-.19147.03811-.13077-.01295-.19147-.03811-.11585-.06204-.16228-.10853l-5.000002-5c-.070006-.069927-.11769-.159054-.137015-.256096-.019325-.097043-.009423-.197638.028453-.289049.037877-.091412.102024-.16953.18432-.224465.082297-.0549354.179044-.08421771.277994-.08413985h9.99997c.099-.00007786.1957.02920445.278.08413985.0823.054935.1465.133053.1843.224465.0379.091411.0478.192006.0285.289049-.0193.097042-.067.186169-.137.256096z" fill="#201f24" /></svg>

                    <select data-testid="form-input" name="category" id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, 'category': e.currentTarget.value })}>
                        <option value=''>Select a category</option>
                        {categories.map((c, i) =>
                            <option key={`${c}-${i}`} value={c}>{c}</option>
                        )}
                    </select>
                </div>
            </div>

            {/* date -> date */}
            <div className="form-group">
                {formErrors.date && <span className="error">{formErrors.date}</span>}
                <label htmlFor="date">Transaction Date</label>
                <input data-testid="form-input" type="date" name="date" id="date" value={formData.date} onInput={(e) => setFormData({ ...formData, 'date': e.currentTarget.value })} />
            </div>

            {/* amount -> number (income / expense)* */}
            <div className="form-group">
                {formErrors.amount && <span className="error">{formErrors.amount}</span>}
                <label htmlFor="amount">Transaction Amount</label>
                <img src="/images/attach-money.svg" alt="$" height={20} width={20} aria-hidden="true" decoding="async" loading="lazy" />
                <input data-testid="form-input" type="number" name="amount" id="amount" value={formData.amount} onInput={(e) => setFormData({ ...formData, 'amount': Number(e.currentTarget.value) })} />
                <span>Use a negative amount to indicate an expense.</span>
            </div>

            {/* recurring -> checkbox */}
            <div className="form-group checkbox-group">
                <label htmlFor="recurring">Recurring</label>
                <input data-testid="form-input" type="checkbox" name="recurring" id="recurring" checked={formData.recurring} onChange={(e) => setFormData({ ...formData, 'recurring': e.currentTarget.checked })} />
            </div>

            <p>Want to delete this transaction? <button data-testid="delete-toggle-btn" className="delete-form-btn" type="button" onClick={() => toggleDelete(selected_transaction)}>Delete form</button></p>
            <button type="submit">Save Changes</button>
        </form>
    )
}