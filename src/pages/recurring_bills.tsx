import { useEffect, useState } from "react"
import { userObj, transaction } from "../types"
import { isPaid, totalUpcoming, dueSoon, filterAndSortArr } from "../helpers/helpers"

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
                        <p>${Math.abs(recurringBills.reduce((a: number, c: transaction) => a + c.amount, 0))}
                        </p>
                    </div>

                    {/* summary */}
                    <div className="summary">
                        <ul>
                            <li>
                                <span>Paid Bills</span>
                                {/* calculate amount* */}
                                <span>{recurringBills.filter(isPaid).length} (${Math.abs(recurringBills.filter(isPaid).reduce((a, c) => a + c.amount, 0))})</span>
                            </li>
                            <li>
                                <span>Total Upcoming</span>
                                {/* calculate amount* */}
                                <span>{recurringBills.filter(totalUpcoming).length} (${Math.abs(recurringBills.filter(totalUpcoming).reduce((a, c) => a + c.amount, 0))})</span>
                            </li>
                            <li>
                                <span>Due Soon</span>
                                {/* calculate amount* */}
                                <span>{recurringBills.filter(dueSoon).length} (${Math.abs(recurringBills.filter(dueSoon).reduce((a, c) => a + c.amount, 0))})</span>
                            </li>
                        </ul>
                    </div>

                </div>
            }

            <div>
                {/* search */}
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.currentTarget.value)} />

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
                            <tr key={t.id}>
                                <td>{t.name}</td>
                                <td>Monthly-{new Date(t.date).toLocaleString('en-GB', { 'day': 'numeric' })}
                                    {dueSoon(t) && <img src="./src/assets/images/icon-bill-due.svg"></img>}
                                    {isPaid(t) && <img src="./src/assets/images/icon-bill-paid.svg"></img>}
                                </td>
                                <td className={dueSoon(t) ? 'danger' : ''}>${Math.abs(t.amount)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default RecurringBills