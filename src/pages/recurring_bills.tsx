import { useEffect, useState } from "react"
import { userObj, transaction } from "../types"
import { isPaid, isUpcoming, dueSoon, filterAndSortArr } from "../helpers/helpers"

interface recurringBillsProps {
    user: userObj,
    recurringBills: transaction[],
    updateRecurringBills: (transactionArr: transaction[]) => void
}

function RecurringBills({ user, recurringBills, updateRecurringBills }: recurringBillsProps) {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortBy, setSortBy] = useState<string>('Latest')

    // fetch function
    async function getRecurringBills() {
        try {
            const response = await fetch('http://localhost:8000/finance-api/transactions/recurring', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data = await response.json()

            updateRecurringBills(data)

            console.log(data)

            // 401 status -> change auth status*

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!recurringBills.length) {
            getRecurringBills()
        }
    })

    return (
        <>
            <h1>RecurringBills page</h1>
            {/* total and summary */}
            {recurringBills.length &&
                <div>

                    <div className="total">
                        <p>Total Bills</p>
                        <p data-testid="total">${Math.abs(recurringBills.reduce((a: number, c: transaction) => a + c.amount, 0)).toFixed(2)}
                        </p>
                    </div>

                    {/* summary */}
                    <div className="summary">
                        <ul>
                            <li>
                                <span>Paid Bills</span>
                                {/* calculate amount* */}
                                <span data-testid="paid">{recurringBills.filter(isPaid).length} (${Math.abs(recurringBills.filter(isPaid).reduce((a, c) => a + c.amount, 0)).toFixed(2)})</span>
                            </li>
                            <li>
                                <span>Total Upcoming</span>
                                {/* calculate amount* */}
                                <span data-testid="upcoming">{recurringBills.filter(isUpcoming).length} (${Math.abs(recurringBills.filter(isUpcoming).reduce((a, c) => a + c.amount, 0)).toFixed(2)})</span>
                            </li>
                            <li>
                                <span>Due Soon</span>
                                {/* calculate amount* */}
                                <span>{recurringBills.filter(dueSoon).length} (${Math.abs(recurringBills.filter(dueSoon).reduce((a, c) => a + c.amount, 0)).toFixed(2)})</span>
                            </li>
                        </ul>
                    </div>

                </div>
            }

            <div>
                {/* search */}
                <input data-testid="search" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.currentTarget.value)} />

                {/* sort */}
                <select name="sort" id="sort" onChange={(e) => setSortBy(e.currentTarget.value)}>
                    <option value="Latest">Latest</option>
                    <option value="Oldest">Oldest</option>
                    <option value="A-to-Z">A to Z</option>
                    <option value="Z-to-A">Z to A</option>
                    <option value="Highest">Highest</option>
                    <option value="Lowest">Lowest</option>
                </select>

                <table>
                    <thead>
                        <tr>
                            <th>Bill Title</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recurringBills.length && filterAndSortArr(recurringBills, searchTerm, sortBy).map(t =>
                            <tr data-testid="bill" key={t.id}>
                                <td>{t.name}</td>
                                <td data-testid="date">Monthly-{new Date(t.date).toLocaleString('en-GB', { 'day': 'numeric' })}
                                    {dueSoon(t) && <img src="./src/assets/images/icon-bill-due.svg"></img>}
                                    {isPaid(t) && <img src="./src/assets/images/icon-bill-paid.svg"></img>}
                                </td>
                                <td data-testid="amount" className={dueSoon(t) ? 'danger' : ''}>${Math.abs(t.amount).toFixed(2)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default RecurringBills