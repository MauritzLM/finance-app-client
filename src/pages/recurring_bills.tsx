import { useEffect } from "react"
import { userObj, transaction } from "../types"

interface recurringBillsProps {
    user: userObj,
    recurringBills: transaction[],
    updateRecurringBills: (transactionArr: transaction[]) => void
}

function RecurringBills({ user, recurringBills, updateRecurringBills }: recurringBillsProps) {
  
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

                     {/* add summary */}
                    <div className="summary"></div>

                </div>
            }

            <div>
                {/* add search / sort* */}
                <table>
                    <thead>
                        <tr>
                            <th>Bill Title</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recurringBills.length && recurringBills.map(t =>
                            <tr key={t.id}>
                                <td>{t.name}</td>
                                <td>{t.date}</td>
                                <td>${Math.abs(t.amount)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default RecurringBills