/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { userObj, transaction } from "../../types"

interface LatestSpendingProps {
    user: userObj,
    category: string,
}

function LatestSpending({ user, category }: LatestSpendingProps) {
    const [transactions, setTransactions] = useState<transaction[]>([])

    // function to fetch latest transactions
    async function getLatestSpending() {
        try {
            const response = await fetch(`https://web-production-de787.up.railway.app/finance-api/budgets/${category}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data: transaction[] = await response.json()
            console.log(data)
            setTransactions([...data])

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!transactions.length) {
            getLatestSpending()
        }
    }, [])

    return (
        <>
            {transactions.length > 0 &&
                <ul>
                    {transactions.map(t =>
                        <li key={t.date}>
                            <div>
                                <img src={t.avatar} alt="avatar image" loading="lazy" decoding="async" height={32} width={32} aria-hidden="true" />
                                <span>{t.name}</span>
                            </div>
                            <div>
                                <span data-testid="amount">-${(Math.abs(t.amount) / 100).toFixed(2)}</span>
                                <span data-testid="date">{new Date(t.date).toLocaleString('en-GB', { 'day': 'numeric', 'month': 'short', 'year': 'numeric' })}</span>
                            </div>

                        </li>
                    )}
                </ul>
            }
        </>
    )
}

export default LatestSpending