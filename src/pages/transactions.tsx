import { useEffect, useState } from "react"
import { userObj, transaction } from "../types"

interface transactionsProps {
    user: userObj
}

function Transactions({ user }: transactionsProps) {
    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState(1)
    const [category, setCategory] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('Latest')
    const [transactions, setTransactions] = useState<transaction[]>([])

    // get transactions
    async function getTransactions() {
        try {
            const response = await fetch(`http://localhost:8000/finance-api/transactions/${category}/${sortBy}/${pageNumber}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data = await response.json()

            console.log(data)

            setTransactions([...data.page_list])
            setNumPages(data.num_pages)

        } catch (error) {
            console.log(error)
        }
    }

    // get transactions by search term
    async function getTransactionsSearch(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            let formatted_term = searchTerm

            if (searchTerm === '') {
                formatted_term = 'empty'
            }

            const response = await fetch(`http://localhost:8000/finance-api/transactions/search/${formatted_term}/${sortBy}/${pageNumber}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data = await response.json()

            setTransactions([...data.page_list])
            setCategory(data.num_pages)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTransactions()

    }, [category, sortBy, pageNumber])

    return (
        <>
            <h1>Transactions page</h1>
            <div>
                {/* include search bar, sortby, category inputs* */}
                <div>
                    <form onSubmit={(e) => getTransactionsSearch(e)}>
                        <input type="text" name="search" value={searchTerm} onInput={(e) => setSearchTerm(e.currentTarget.value)}></input>
                        <button type="submit">search</button>
                    </form>

                    {/* sort */}
                    <select name="sort" id="sort" onChange={(e) => setSortBy(e.currentTarget.value)}>
                        <option value="Latest">Latest</option>
                        <option value="Oldest">Oldest</option>
                        <option value="A-to-Z">A to Z</option>
                        <option value="Z-to-A">Z to A</option>
                        <option value="Highest">Highest</option>
                        <option value="Lowest">Lowest</option>
                    </select>

                    {/* category */}
                    <select name="category" id="category" onChange={(e) => setCategory(e.currentTarget.value)}>
                        <option value="All">All Transactions</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Bills">Bills</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Dining Out">Dining Out</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Personal Care">Personal Care</option>
                        <option value="General">General</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Education">Education</option>
                        <option value="Shopping">Shopping</option>
                    </select>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Recipient / Sender</th>
                            <th>Category</th>
                            <th>Transaction Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions?.map(t =>
                            <tr key={t.id}>
                                <td>{t.name}</td>
                                <td>{t.category}</td>
                                <td>{t.date}</td>
                                <td>{t.amount}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <button disabled={pageNumber === 1 ? true : false} onClick={() => setPageNumber(pageNumber - 1)}>Prev</button>

            <div className="page-buttons">
                {Array.from({ length: numPages }, (v, i) => i + 1).map(page =>
                    <button key={page} onClick={() => setPageNumber(page)} disabled={pageNumber === page ? true : false}>{page}</button>
                )}
            </div>

            <button disabled={pageNumber === numPages ? true : false} onClick={() => setPageNumber(pageNumber + 1)}>Next</button>
        </>
    )
}

export default Transactions