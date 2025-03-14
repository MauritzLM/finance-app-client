import { useEffect, useState } from "react"
import { userObj, overviewData, transaction, pot, budget, budget_spending } from "../types"
import { Link } from "react-router-dom"
import { isPaid, isUpcoming, dueSoon, formatTransaction, calculateOffset } from "../helpers/helpers"
import '../assets/sass/overview.scss'

interface overviewProps {
    user: userObj,
    updatePots: (potsArr: pot[]) => void,
    updateBudgets: (budgetsArr: budget[]) => void,
    updateBudgetSpending: (spendingObj: budget_spending) => void,
    updateRecurringBills: (transactionArr: transaction[]) => void,
    isAuthenticated: boolean,
    updateAuthStatus: (b: boolean) => void
}

function Overview({ user, updatePots, updateBudgets, updateBudgetSpending, updateRecurringBills, isAuthenticated, updateAuthStatus }: overviewProps) {
    const [overviewData, setOverviewData] = useState<overviewData>({ 'pots': [], 'budgets': [], 'expenses': [], 'recent_transactions': [], 'recurring_bills': [], 'income': [], 'budget_spending': {} })
    const [expenses, setExpenses] = useState<number>()
    const [income, setIncome] = useState<number>()
    const [isLoading, setIsLoading] = useState(true)

    // fetch overview content
    async function getOverviewData() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/finance-api/overview`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data: overviewData = await response.json()

            if (response.status === 401) {
                updateAuthStatus(false)
                // clear localstorage
                localStorage.removeItem('user')
                return
            }

            if (response.status === 200) {
                // set overview data
                setOverviewData(data)
                setIsLoading(false)

                // update pots, budgets and recurringbills
                updatePots(data.pots)
                updateBudgets(data.budgets)
                updateBudgetSpending(data.budget_spending)
                updateRecurringBills(data.recurring_bills)

                // calculate and set income and expenses
                setExpenses(data.expenses.reduce((a: number, c: transaction) => a + c.amount, 0))
                setIncome(data.income.reduce((a: number, c: transaction) => a + c.amount, 0))
            }

        } catch (error) {
            console.log(error)
        }
    }

    // logout
    async function handleLogout() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/finance-api/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${user.token}`
                }
            });

            // if success change authorized state
            if (response.status === 204) {
                updateAuthStatus(false)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (Object.keys(overviewData).length !== 6) {
            getOverviewData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {isAuthenticated &&
                <button className='logout-btn' onClick={() => handleLogout()}>Logout</button>
            }
            <div className="overview-wrapper">
                <section className="balance">
                    <h1>Overview</h1>
                    <div className="balance-wrapper">
                        <div className="balance">
                            <h2>Balance</h2>
                            {isLoading && <div className="spinner-wrapper"><div className="lds-dual-ring"></div></div>}
                            <span data-testid="balance" className={isLoading ? 'hide' : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFF"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                {income && expenses ? ((income + expenses) / 100).toFixed(2) : 0}
                            </span>
                        </div>
                        <div>
                            <h2>Income</h2>
                            {isLoading && <div className="spinner-wrapper"><div className="lds-dual-ring"></div></div>}
                            <span data-testid="income" className={isLoading ? 'hide' : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                {income ? (income / 100).toFixed(2) : 0}
                            </span>
                        </div>
                        <div>
                            <h2>Expenses</h2>
                            {isLoading && <div className="spinner-wrapper"><div className="lds-dual-ring"></div></div>}
                            <span data-testid="expenses" className={isLoading ? 'hide' : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                {expenses ? Math.abs(expenses / 100).toFixed(2) : 0}
                            </span>
                        </div>
                    </div>
                </section>

                <div className="row-2">
                    {/* pots */}
                    <section className="pots">
                        <h2>Pots</h2>
                        {/* total */}
                        <Link className="page-link" to="/pots">
                            <span>See Details</span>
                            <svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg"><path d="m.853506.146465 5.000004 5.000005c.04648.04643.08336.10158.10853.16228.02516.06069.03811.12576.03811.19147 0 .0657-.01295.13077-.03811.19147-.02517.06069-.06205.11584-.10853.16228l-5.000004 5.00003c-.069927.07-.159054.1177-.256097.137-.097042.0193-.197637.0094-.289048-.0285-.091412-.0378-.16953-.102-.2244652-.1843-.0549354-.0823-.08421767-.179-.08413981-.278l-.00000043-9.999984c-.00007788-.098949.02920444-.195695.08413984-.277992.0549356-.082297.1330536-.1464431.2244646-.1843193.091412-.03787611.192007-.04777907.289049-.02845381.097042.01932521.186169.06700801.256097.13701411z" fill="#696868" /></svg>
                        </Link>
                        {Object.keys(overviewData).includes('pots') &&
                            <div>
                                <div className="total">
                                    <svg fill="none" height="36" viewBox="0 0 28 36" width="28" xmlns="http://www.w3.org/2000/svg"><path d="m22.4375 5.8875v-2.8875c0-.58016-.2305-1.13656-.6407-1.5468-.4102-.41023-.9666-.6407-1.5468-.6407h-12.5c-.58016 0-1.13656.23047-1.5468.6407-.41023.41024-.6407.96664-.6407 1.5468v2.8875c-1.39375.22446-2.66214.93755-3.57823 2.01165-.91608 1.07411-1.420065 2.43915-1.42177 3.85085v17.5c0 1.5747.62556 3.0849 1.73905 4.1984 1.1135 1.1135 2.62373 1.7391 4.19845 1.7391h15c1.5747 0 3.0849-.6256 4.1984-1.7391s1.7391-2.6237 1.7391-4.1984v-17.5c-.0017-1.4117-.5057-2.77674-1.4218-3.85085-.9161-1.0741-2.1845-1.78719-3.5782-2.01165zm-1.875-2.8875v2.8125h-3.125v-3.125h2.8125c.0829 0 .1624.03292.221.09153.0586.0586.0915.13809.0915.22097zm-8.125 2.8125v-3.125h3.125v3.125zm-4.6875-3.125h2.8125v3.125h-3.125v-2.8125c0-.08288.03292-.16237.09153-.22097.0586-.05861.13809-.09153.22097-.09153zm17.8125 26.5625c0 .5335-.1051 1.0618-.3092 1.5547-.2042.4928-.5034.9407-.8807 1.3179-.3772.3773-.8251.6765-1.3179.8807-.4929.2041-1.0212.3092-1.5547.3092h-15c-.53349 0-1.06177-.1051-1.55465-.3092-.49289-.2042-.94073-.5034-1.31797-.8807-.37724-.3772-.67648-.8251-.88064-1.3179-.20416-.4929-.30924-1.0212-.30924-1.5547v-17.5c0-1.0774.42801-2.11075 1.18988-2.87262s1.79518-1.18988 2.87262-1.18988h15c1.0774 0 2.1108.42801 2.8726 1.18988.7619.76187 1.1899 1.79522 1.1899 2.87262zm-6.875-6.25c0 .9117-.3622 1.786-1.0068 2.4307-.6447.6446-1.519 1.0068-2.4307 1.0068h-.3125v1.5625c0 .2486-.0988.4871-.2746.6629s-.4143.2746-.6629.2746-.4871-.0988-.6629-.2746-.2746-.4143-.2746-.6629v-1.5625h-1.5625c-.2486 0-.4871-.0988-.6629-.2746s-.2746-.4143-.2746-.6629.0988-.4871.2746-.6629.4143-.2746.6629-.2746h3.75c.4144 0 .8118-.1646 1.1049-.4576.293-.2931.4576-.6905.4576-1.1049s-.1646-.8118-.4576-1.1049c-.2931-.293-.6905-.4576-1.1049-.4576h-2.5c-.9117 0-1.786-.3622-2.4307-1.0068-.64464-.6447-1.0068-1.519-1.0068-2.4307s.36216-1.786 1.0068-2.4307c.6447-.6446 1.519-1.0068 2.4307-1.0068h.3125v-1.5625c0-.2486.0988-.4871.2746-.6629s.4143-.2746.6629-.2746.4871.0988.6629.2746.2746.4143.2746.6629v1.5625h1.5625c.2486 0 .4871.0988.6629.2746s.2746.4143.2746.6629-.0988.4871-.2746.6629-.4143.2746-.6629.2746h-3.75c-.4144 0-.8118.1646-1.1049.4576-.293.2931-.4576.6905-.4576 1.1049s.1646.8118.4576 1.1049c.2931.293.6905.4576 1.1049.4576h2.5c.9117 0 1.786.3622 2.4307 1.0068.6446.6447 1.0068 1.519 1.0068 2.4307z" fill="#277c78" /></svg>
                                    <div>
                                        <span>Total Saved</span>
                                        <span data-testid="pots-total">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                            {Math.floor(overviewData.pots.reduce((a, c) => a + c.total, 0)) / 100}</span>
                                    </div>
                                </div>

                                <ul>
                                    {overviewData.pots.slice(0, 4).map(pot =>
                                        <li data-testid='pot-item' key={pot.name}>
                                            <div style={{ backgroundColor: pot.theme }}></div>
                                            <span>{pot.name}</span>
                                            <span data-testid="pot-total">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                                {Math.floor(pot.total) / 100}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        }
                    </section>

                    {/* transactions */}
                    <section className="transactions">
                        <h2>Transactions</h2>
                        <Link className="page-link" to="/transactions">
                            <span>View All</span>
                            <svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg"><path d="m.853506.146465 5.000004 5.000005c.04648.04643.08336.10158.10853.16228.02516.06069.03811.12576.03811.19147 0 .0657-.01295.13077-.03811.19147-.02517.06069-.06205.11584-.10853.16228l-5.000004 5.00003c-.069927.07-.159054.1177-.256097.137-.097042.0193-.197637.0094-.289048-.0285-.091412-.0378-.16953-.102-.2244652-.1843-.0549354-.0823-.08421767-.179-.08413981-.278l-.00000043-9.999984c-.00007788-.098949.02920444-.195695.08413984-.277992.0549356-.082297.1330536-.1464431.2244646-.1843193.091412-.03787611.192007-.04777907.289049-.02845381.097042.01932521.186169.06700801.256097.13701411z" fill="#696868" /></svg>
                        </Link>
                        <ul>
                            {Object.keys(overviewData).includes('recent_transactions') && overviewData.recent_transactions.map(item =>
                                <li data-testid="transaction" key={item.date}>
                                    <div>
                                        <img className="t-image" src={item.avatar} alt="avatar" height="32px" width="32px" />
                                        <span>{item.name}</span>
                                    </div>
                                    <div>
                                        <span data-testid="t-amount" className={item.amount < 0 ? '' : 'income'}>{formatTransaction(item.amount.toString())}</span>
                                        <span data-testid="t-dates">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>

                                </li>
                            )}
                        </ul>
                    </section>

                    {/* budgets */}
                    <section className="budgets">
                        <h2>Budgets</h2>
                        <Link className="page-link" to="/budgets">
                            <span>See Details</span>
                            <svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg"><path d="m.853506.146465 5.000004 5.000005c.04648.04643.08336.10158.10853.16228.02516.06069.03811.12576.03811.19147 0 .0657-.01295.13077-.03811.19147-.02517.06069-.06205.11584-.10853.16228l-5.000004 5.00003c-.069927.07-.159054.1177-.256097.137-.097042.0193-.197637.0094-.289048-.0285-.091412-.0378-.16953-.102-.2244652-.1843-.0549354-.0823-.08421767-.179-.08413981-.278l-.00000043-9.999984c-.00007788-.098949.02920444-.195695.08413984-.277992.0549356-.082297.1330536-.1464431.2244646-.1843193.091412-.03787611.192007-.04777907.289049-.02845381.097042.01932521.186169.06700801.256097.13701411z" fill="#696868" /></svg>
                        </Link>
                        {Object.keys(overviewData).includes('budgets') &&
                            <div className="wrapper">
                                {/* budget graphic and total */}
                                <div className="color-wheel">
                                    <div className="total">
                                        {/* calculate total spent* */}
                                        <span data-testid="budgets-spent">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                            {Math.floor(Math.abs(Object.values(overviewData.budget_spending).reduce((a, c) => a + c, 0)) / 100)}</span>
                                        {/* limit */}
                                        <span data-testid="budgets-limit">of
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                            {overviewData.budgets.reduce((a, c) => a + c.maximum, 0) / 100} limit</span>
                                    </div>

                                    <svg width="240" height="240" viewBox="0 0 240 240">
                                        {overviewData.budgets.map((b, i) =>
                                            <circle key={i} className="bg"
                                                cx="120" cy="120" r="104" fill="none" stroke={b.theme} strokeWidth="32" strokeDasharray={`${(b.maximum / (overviewData.budgets.reduce((a, c) => a + c.maximum, 0))) * 653.45} ${653.45 - (b.maximum / (overviewData.budgets.reduce((a, c) => a + c.maximum, 0)) * 653.45)}`}
                                                strokeDashoffset={calculateOffset(i, overviewData.budgets, 653.45)}
                                            ></circle>
                                        )}
                                    </svg>
                                </div>

                                <ul>
                                    {overviewData.budgets.map(budget =>
                                        <li key={budget.category} >
                                            <div style={{ backgroundColor: budget.theme }}></div>
                                            <span>{budget.category}</span>
                                            <span data-testid="budget-maximum">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                                {(budget.maximum / 100).toFixed(2)}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        }
                    </section>

                    {/* recurring bills */}
                    <section className="recurring-bills">
                        <h2>Recurring Bills</h2>
                        <Link className="page-link" to="/recurring-bills">
                            <span>See Details</span>
                            <svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg"><path d="m.853506.146465 5.000004 5.000005c.04648.04643.08336.10158.10853.16228.02516.06069.03811.12576.03811.19147 0 .0657-.01295.13077-.03811.19147-.02517.06069-.06205.11584-.10853.16228l-5.000004 5.00003c-.069927.07-.159054.1177-.256097.137-.097042.0193-.197637.0094-.289048-.0285-.091412-.0378-.16953-.102-.2244652-.1843-.0549354-.0823-.08421767-.179-.08413981-.278l-.00000043-9.999984c-.00007788-.098949.02920444-.195695.08413984-.277992.0549356-.082297.1330536-.1464431.2244646-.1843193.091412-.03787611.192007-.04777907.289049-.02845381.097042.01932521.186169.06700801.256097.13701411z" fill="#696868" /></svg>
                        </Link>
                        {Object.keys(overviewData).includes('recurring_bills') &&
                            <ul>
                                <li data-testid="recurring-item">
                                    <span>Paid Bills</span>
                                    <span data-testid="paid">${(Math.abs(overviewData.recurring_bills.filter(isPaid).reduce((a, c) => a + c.amount, 0)) / 100).toFixed(2)}</span>
                                </li>
                                <li data-testid="recurring-item">
                                    <span>Total Upcoming</span>
                                    <span>${(Math.abs(overviewData.recurring_bills.filter(isUpcoming).reduce((a, c) => a + c.amount, 0)) / 100).toFixed(2)}</span>
                                </li>
                                <li data-testid="recurring-item">
                                    <span>Due Soon</span>
                                    <span>${(Math.abs(overviewData.recurring_bills.filter(dueSoon).reduce((a, c) => a + c.amount, 0)) / 100).toFixed(2)}</span>
                                </li>
                            </ul>
                        }
                    </section>
                </div>
            </div>
        </>
    )
}

export default Overview