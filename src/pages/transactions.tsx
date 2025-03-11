/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import { userObj, transaction } from "../types"
import { formatTransaction, separateButtons } from "../helpers/helpers"
import '../assets/sass/transactions.scss'
import NewTransactionForm from "../components/transactions/new_transaction_form"
import EditTransactionForm from "../components/transactions/edit_transaction_form"
import DeleteTransactionForm from "../components/transactions/delete_transaction_form"

interface transactionsProps {
    user: userObj,
    recurringBills: transaction[],
    updateRecurringBills: (transactionArr: transaction[]) => void
}

function Transactions({ user, recurringBills, updateRecurringBills }: transactionsProps) {
    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState(1)
    const [category, setCategory] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('Latest')
    const [transactions, setTransactions] = useState<transaction[]>([])
    const [pageBtnToggle, setPageBtnToggle] = useState(false)
    const [activeSelect, setActiveSelect] = useState('')
    const [showNewForm, setShowNewForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showDeleteForm, setShowDeleteform] = useState(false)
    const [selectedTransation, setSelectedTransaction] = useState({} as transaction)

    // option refs

    const sortRef = useRef<HTMLUListElement>(null)


    function buttonToggle() {
        if (pageBtnToggle) {
            setPageBtnToggle(false)
        }

        else {
            setPageBtnToggle(true)
        }
    }

    function hideNewForm() {
        setShowNewForm(false)
    }

    function hideEditForm() {
        setShowEditForm(false)
    }

    function hideDeleteForm() {
        setShowDeleteform(false)
    }

    function toggleEdit(t: transaction) {
        setShowEditForm(true)
        setSelectedTransaction(t)
    }

    function toggleDelete(t: transaction) {
        setShowDeleteform(true)
        setSelectedTransaction(t)
        setShowEditForm(false)
    }

    // toggle the current active select element
    function selectToggle(select: string) {
        if (select === activeSelect) {
            setActiveSelect('')
        }

        else {
            setActiveSelect(select)
        }
    }

    // handle key press on custom select elements*
    function handleKeyPress(select: string, event: React.KeyboardEvent<HTMLButtonElement>) {
        // option array
        // Esc
        if (event.key === 'Escape') {
            setActiveSelect('')
        }

        // arrow keys*
        if (event.key === 'ArrowDown') {
            event.preventDefault()

            if (activeSelect !== select && sortRef.current) {
                setActiveSelect(select);
                (sortRef.current.childNodes[1] as HTMLLIElement).focus()
                // console.log(document.activeElement)
            }
            //  1. is select open? 2. currently focused option 3. current focus
        }
    }

    // get transactions
    async function getTransactions() {
        try {

            let formatted_term = searchTerm

            if (searchTerm === '') {
                formatted_term = 'empty'
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/finance-api/transactions/${formatted_term}/${category}/${sortBy}/${pageNumber}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data = await response.json()

            setTransactions([...data.page_list])
            setNumPages(data.num_pages)
            setActiveSelect('')

            // 401 status -> change auth status*

        } catch (error) {
            console.log(error)
        }
    }

    // get transactions by search term -> initial search
    async function getTransactionsSearch(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const response = await fetch(`${import.meta.env.VITE_API_URL}/finance-api/transactions/search/${searchTerm}/${sortBy}/${1}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data = await response.json()

            setTransactions([...data.page_list])
            setNumPages(data.num_pages)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTransactions()

    }, [category, sortBy, pageNumber])

    return (
        <>
            <section className="header">
                <h1 className="t-h1">Transactions</h1>
                <button data-testid="new-btn" onClick={() => setShowNewForm(true)} className="new-btn t-btn">+ New Transaction</button>
            </section>

            <div className="transactions-wrapper">
                {/* include search bar, sortby, category inputs* */}
                <div className="top-bar">
                    <form onSubmit={(e) => getTransactionsSearch(e)}>
                        <input type="text" name="search" value={searchTerm} onInput={(e) => setSearchTerm(e.currentTarget.value)} placeholder="Search transaction"></input>
                        <button type="submit" disabled={searchTerm === '' ? true : false}>
                            <svg fill="none" height="16" viewBox="0 0 14 14" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m13.3538 13.1462-3.1294-3.1287c.907-1.08894 1.3593-2.48564 1.2628-3.89955-.0966-1.41391-.7345-2.73618-1.78109-3.69173-1.0466-.95555-2.42131-1.470821-3.83815-1.438621-1.41683.032201-2.76671.609391-3.76883 1.611501-1.00211 1.00212-1.579301 2.352-1.611501 3.76883-.0322 1.41684.483071 2.79155 1.438621 3.83817.95556 1.0466 2.27782 1.6845 3.69173 1.781 1.41391.0966 2.81061-.3557 3.89954-1.2627l3.12878 3.1293c.0464.0465.1016.0833.1623.1085.0607.0251.1257.0381.1914.0381s.1308-.013.1915-.0381c.0607-.0252.1158-.062.1623-.1085.0464-.0464.0833-.1016.1084-.1623.0252-.0607.0381-.1257.0381-.1914s-.0129-.1308-.0381-.1915c-.0251-.0607-.062-.1158-.1084-.1623zm-11.85378-6.64621c0-.89002.26392-1.76005.75839-2.50007.49446-.74002 1.19727-1.31679 2.01954-1.65739.82226-.34059 1.72706-.42971 2.59998-.25607.87291.17363 1.67473.60221 2.30407 1.23155s1.0579 1.43116 1.2316 2.30407c.1736.87292.0845 1.77772-.2561 2.59999-.34062.82226-.91739 1.52507-1.65741 2.01953-.74002.4945-1.61005.7584-2.50007.7584-1.19307-.0013-2.33689-.4759-3.18052-1.31949-.84363-.84363-1.31816-1.98745-1.31948-3.18052z" fill="#201F24" /></svg>
                        </button>
                    </form>

                    {/* custom sort select */}
                    <div className="col-2">
                        <div className={activeSelect === 'sort' ? 'cs-active sort' : 'sort'}>
                            <span className="label">Sort by</span>
                            <button onKeyDown={(e) => handleKeyPress('sort', e)} onClick={() => selectToggle('sort')} role="combobox" id="sort-select" value="Select" aria-expanded={activeSelect === 'sort' ? true : false} aria-controls="listbox-sort" aria-haspopup="listbox">
                                <span>{sortBy}</span>
                                <svg fill="none" height="20" viewBox="0 0 16 15" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m14.25 0h-12.5c-.33152 0-.64946.131696-.883884.366116-.23442.234421-.366116.552363-.366116.883884v12.5c0 .3315.131696.6495.366116.8839.234424.2344.552364.3661.883884.3661h12.5c.3315 0 .6495-.1317.8839-.3661s.3661-.5524.3661-.8839v-12.5c0-.331521-.1317-.649463-.3661-.883884-.2344-.23442-.5524-.366116-.8839-.366116zm-10.625 3.125h7.5c.1658 0 .3247.06585.4419.18306.1173.11721.1831.27618.1831.44194s-.0658.32473-.1831.44194c-.1172.11721-.2761.18306-.4419.18306h-7.5c-.16576 0-.32473-.06585-.44194-.18306s-.18306-.27618-.18306-.44194.06585-.32473.18306-.44194.27618-.18306.44194-.18306zm3.125 8.75h-3.125c-.16576 0-.32473-.0658-.44194-.1831-.11721-.1172-.18306-.2761-.18306-.4419s.06585-.3247.18306-.4419c.11721-.1173.27618-.1831.44194-.1831h3.125c.16576 0 .32473.0658.44194.1831.11721.1172.18306.2761.18306.4419s-.06585.3247-.18306.4419c-.11721.1173-.27618.1831-.44194.1831zm.625-3.75h-3.75c-.16576 0-.32473-.06585-.44194-.18306s-.18306-.27618-.18306-.44194.06585-.32473.18306-.44194.27618-.18306.44194-.18306h3.75c.16576 0 .32473.06585.44194.18306s.18306.27618.18306.44194-.06585.32473-.18306.44194-.27618.18306-.44194.18306zm6.0672 2.3172-1.875 1.875c-.0581.0581-.127.1042-.2029.1357-.0758.0314-.1572.0476-.2393.0476s-.1635-.0162-.2393-.0476c-.0759-.0315-.1448-.0776-.2029-.1357l-1.87499-1.875c-.11727-.1173-.18316-.2763-.18316-.4422 0-.16585.06589-.32491.18316-.44219.11728-.11727.27634-.18316.44219-.18316s.32491.06589.44219.18316l.80781.80859v-3.4914c0-.16576.0658-.32473.1831-.44194.1172-.11721.2761-.18306.4419-.18306s.3247.06585.4419.18306c.1173.11721.1831.27618.1831.44194v3.4914l.8078-.80859c.1173-.11727.2763-.18316.4422-.18316s.3249.06589.4422.18316c.1173.11728.1831.27634.1831.44219 0 .1659-.0658.3249-.1831.4422z" fill="#201f24" /></svg>
                            </button>

                            {/* dropdown */}
                            <ul ref={sortRef} role="listbox" id="listbox-sort">
                                <span>Sort by</span>
                                <li role="option" className={sortBy === 'Latest' ? 'cs-active' : ''} onClick={() => setSortBy('Latest')}>Latest</li>
                                <li role="option" className={sortBy === 'Oldest' ? 'cs-active' : ''} onClick={() => setSortBy('Oldest')}>Oldest</li>
                                <li role="option" className={sortBy === 'A-to-Z' ? 'cs-active' : ''} onClick={() => setSortBy('A-to-Z')}>A to Z</li>
                                <li role="option" className={sortBy === 'Z-to-A' ? 'cs-active' : ''} onClick={() => setSortBy('Z-to-A')}>Z to A</li>
                                <li role="option" className={sortBy === 'Highest' ? 'cs-active' : ''} onClick={() => setSortBy('Highest')}>Highest</li>
                                <li role="option" className={sortBy === 'Lowest' ? 'cs-active' : ''} onClick={() => setSortBy('Lowest')}>Lowest</li>
                            </ul>

                            <svg fill="none" height="6" viewBox="0 0 12 6" width="12" xmlns="http://www.w3.org/2000/svg"><path d="m11.3538.85375-5.00002 5c-.04644.04649-.10158.08337-.16228.10853s-.12576.03811-.19147.03811-.13077-.01295-.19147-.03811-.11585-.06204-.16228-.10853l-5.000002-5c-.070006-.069927-.11769-.159054-.137015-.256096-.019325-.097043-.009423-.197638.028453-.289049.037877-.091412.102024-.16953.18432-.224465.082297-.0549354.179044-.08421771.277994-.08413985h9.99997c.099-.00007786.1957.02920445.278.08413985.0823.054935.1465.133053.1843.224465.0379.091411.0478.192006.0285.289049-.0193.097042-.067.186169-.137.256096z" fill="#201f24" /></svg>
                        </div>



                        {/* category */}
                        <div className={activeSelect === 'category' ? 'cs-active category' : 'category'}>
                            <span className="label">Category</span>
                            <button onKeyDown={(e) => handleKeyPress('category', e)} onClick={() => selectToggle('category')} role="combobox" id="sort-select" value="Select" tabIndex={0} aria-expanded={activeSelect === 'category' ? true : false} aria-controls="listbox-category" aria-haspopup="listbox">
                                <span>{category}</span>
                                <svg fill="none" height="20" viewBox="0 0 18 16" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m16.7976 2.71562-.0062.00704-5.2914 5.65v4.33514c.0003.2062-.0504.4092-.1476.5911-.0972.1818-.2379.3368-.4095.4511l-2.49995 1.6672c-.1884.1255-.40734.1975-.63344.2082-.22611.0108-.45091-.04-.65039-.147s-.36616-.2662-.48225-.4605-.17723-.4165-.17689-.6429v-6.00234l-5.29141-5.65-.00625-.00704c-.16269-.17905-.269938-.40146-.308716-.64026s-.007425-.48373.090256-.70506c.09768-.22133.25749-.409563.46005-.541857.20255-.132294.43914-.202966.68107-.203443h13.75002c.2421.000024.479.070368.6819.202485.2029.132118.3631.320325.4611.541745.0979.22142.1295.46653.0908.70555-.0387.23901-.146.46165-.3088.64084z" fill="#201f24" /></svg>
                            </button>

                            {/* custom category select */}
                            <ul role="listbox" id="listbox-category">
                                <span>Category</span>
                                <li role="option" className={category === 'All' ? 'cs-active' : ''} onClick={() => setCategory('All')}>All Transactions</li>
                                <li role="option" className={category === 'Entertainment' ? 'cs-active' : ''} onClick={() => setCategory('Entertainment')}>Entertainment</li>
                                <li role="option" className={category === 'Bills' ? 'cs-active' : ''} onClick={() => setCategory('Bills')}>Bills</li>
                                <li role="option" className={category === 'Groceries' ? 'cs-active' : ''} onClick={() => setCategory('Groceries')}>Groceries</li>
                                <li role="option" className={category === 'Dining Out' ? 'cs-active' : ''} onClick={() => setCategory('Dining Out')}>Dining Out</li>
                                <li role="option" className={category === 'Transportation' ? 'cs-active' : ''} onClick={() => setCategory('Transportation')}>Transportation</li>
                                <li role="option" className={category === 'Personal Care' ? 'cs-active' : ''} onClick={() => setCategory('Personal Care')}>Personal Care</li>
                                <li role="option" className={category === 'General' ? 'cs-active' : ''} onClick={() => setCategory('General')}>General</li>
                                <li role="option" className={category === 'Lifestyle' ? 'cs-active' : ''} onClick={() => setCategory('Lifestyle')}>Lifestyle</li>
                                <li role="option" className={category === 'Education' ? 'cs-active' : ''} onClick={() => setCategory('Education')}>Education</li>
                                <li role="option" className={category === 'Shopping' ? 'cs-active' : ''} onClick={() => setCategory('Shopping')}>Shopping</li>
                            </ul>

                            <svg fill="none" height="6" viewBox="0 0 12 6" width="12" xmlns="http://www.w3.org/2000/svg"><path d="m11.3538.85375-5.00002 5c-.04644.04649-.10158.08337-.16228.10853s-.12576.03811-.19147.03811-.13077-.01295-.19147-.03811-.11585-.06204-.16228-.10853l-5.000002-5c-.070006-.069927-.11769-.159054-.137015-.256096-.019325-.097043-.009423-.197638.028453-.289049.037877-.091412.102024-.16953.18432-.224465.082297-.0549354.179044-.08421771.277994-.08413985h9.99997c.099-.00007786.1957.02920445.278.08413985.0823.054935.1465.133053.1843.224465.0379.091411.0478.192006.0285.289049-.0193.097042-.067.186169-.137.256096z" fill="#201f24" /></svg>
                        </div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th scope="col">Recipient / Sender</th>
                            <th scope="col">Category</th>
                            <th scope="col">Transaction Date</th>
                            <th scope="col">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions?.map(t =>
                            <tr data-testid="transaction" key={t.id} onClick={() => toggleEdit(t)}>

                                <td>
                                    <img src={t.avatar} alt="" height={32} width={32} loading="lazy" decoding="async" aria-hidden="true" />
                                    <span className="name">{t.name}</span>
                                </td>
                                <td>{t.category}</td>
                                <td data-testid="date">{new Date(t.date).toLocaleString('en-GB', { 'day': 'numeric', 'month': 'short', 'year': 'numeric' })}</td>
                                <td data-testid="amount" className={t.amount < 0 ? 'amount' : 'amount income'}>{formatTransaction(t.amount.toString())}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="page-buttons">
                    <button className="prev-btn" disabled={pageNumber === 1 ? true : false} onClick={() => setPageNumber(pageNumber - 1)}>
                        <svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg"><path d="m5.14656 10.8535-5.000005-4.99997c-.046488-.04643-.0833676-.10158-.1085298-.16228-.0251623-.06069-.03811269-.12576-.0381127-.19147 0-.0657.0129504-.13077.0381126-.19147.0251623-.06069.0620419-.11584.1085299-.16228l4.999995-4.999997c.06993-.0700052.15906-.117689.2561-.13701419.09704-.01932521.19764-.0094229.28905.02845329.09141.0378763.16953.1020229.22447.1843199.05493.082297.08421.179044.08414.277991v10.000017c.00007.0989-.02921.1957-.08414.278-.05494.0823-.13306.1464-.22447.1843s-.19201.0478-.28905.0284c-.09704-.0193-.18617-.067-.25609-.137z" fill="#696868" /></svg>
                        <span>Prev</span>
                    </button>
                    {/* if only 4 pages or less */}
                    {numPages <= 4 && Array.from({ length: numPages }, (_v, i) => i + 1).map(page =>
                        <button className={pageNumber === page ? 'current-page page-btn' : 'page-btn'} data-testid="page-btn" key={page} onClick={() => setPageNumber(page)} disabled={pageNumber === page ? true : false}>{page}</button>
                    )}
                    {/* if more than 4 pages */}
                    {/* buttons 1,2 and last */}
                    {numPages > 4 && separateButtons(numPages)[0].map(page =>
                        <button className={pageNumber === page ? 'current-page page-btn' : 'page-btn'} data-testid="page-btn" key={page} onClick={() => setPageNumber(page)} disabled={pageNumber === page ? true : false}>{page}</button>
                    )}
                    {/* middle buttons with toggle */}
                    {numPages > 4 &&
                        <>
                            <button className={pageBtnToggle ? 'toggle-btn cs-active' : 'toggle-btn'} onClick={() => buttonToggle()}>
                                <svg fill="none" height="4" viewBox="0 0 14 4" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m8.75 2c0 .34612-.10264.68446-.29493.97225-.19229.28778-.4656.51209-.78537.64454s-.67164.16711-1.01111.09958c-.33946-.06752-.65128-.23419-.89603-.47893-.24474-.24474-.41141-.55657-.47893-.89603-.06753-.33947-.03287-.69134.09958-1.01111.13246-.31977.35676-.593079.64454-.785372.28779-.192292.62613-.294928.97225-.294928.46413 0 .90925.184375 1.23744.512563.32819.328187.51256.773307.51256 1.237437zm-6.75-1.75c-.34612 0-.68446.102636-.97225.294928-.287783.192293-.512085.465602-.644538.785372-.132454.31977-.16711.67164-.099585 1.01111.067524.33946.234195.65129.478937.89603.244746.24474.556566.41141.896026.47893.33947.06753.69134.03287 1.01111-.09958s.59308-.35676.78537-.64454c.1923-.28779.29493-.62613.29493-.97225 0-.46413-.18437-.90925-.51256-1.237437-.32819-.328188-.77331-.512563-1.23744-.512563zm10 0c-.3461 0-.6845.102636-.9722.294928-.2878.192293-.5121.465602-.6446.785372-.1324.31977-.1671.67164-.0996 1.01111.0676.33946.2342.65129.479.89603.2447.24474.5565.41141.896.47893.3395.06753.6913.03287 1.0111-.09958s.5931-.35676.7854-.64454c.1923-.28779.2949-.62613.2949-.97225 0-.22981-.0453-.45738-.1332-.6697-.088-.21232-.2169-.405234-.3794-.567737-.1625-.162502-.3554-.291407-.5677-.379352-.2123-.087946-.4399-.133211-.6697-.133211z" fill="#000" /></svg>
                            </button>
                            <div className="toggle-buttons">
                                {separateButtons(numPages)[1].map(page =>
                                    <button className={pageNumber === page ? 'current-page page-btn' : 'page-btn'} data-testid="page-btn" key={page} onClick={() => setPageNumber(page)} disabled={pageNumber === page ? true : false}>{page}</button>)}
                            </div>
                        </>
                    }

                    <button className="next-btn" disabled={pageNumber === numPages ? true : false} onClick={() => setPageNumber(pageNumber + 1)}>
                        <span>Next</span>
                        <svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg"><path d="m.853506.146465 5.000004 5.000005c.04648.04643.08336.10158.10853.16228.02516.06069.03811.12576.03811.19147 0 .0657-.01295.13077-.03811.19147-.02517.06069-.06205.11584-.10853.16228l-5.000004 5.00003c-.069927.07-.159054.1177-.256097.137-.097042.0193-.197637.0094-.289048-.0285-.091412-.0378-.16953-.102-.2244652-.1843-.0549354-.0823-.08421767-.179-.08413981-.278l-.00000043-9.999984c-.00007788-.098949.02920444-.195695.08413984-.277992.0549356-.082297.1330536-.1464431.2244646-.1843193.091412-.03787611.192007-.04777907.289049-.02845381.097042.01932521.186169.06700801.256097.13701411z" fill="#696868" /></svg>
                    </button>
                </div>

            </div>

            {/* forms */}
            {/* new */}
            {showNewForm &&
                <div className="form-modal">
                    <NewTransactionForm user={user} hideNewForm={hideNewForm} recurringBills={recurringBills} updateRecurringBills={updateRecurringBills} />
                </div>
            }
            {/* edit */}
            {showEditForm &&
                <div className="form-modal">
                    <EditTransactionForm user={user} hideEditForm={hideEditForm} toggleDelete={toggleDelete} recurringBills={recurringBills} updateRecurringBills={updateRecurringBills} selected_transaction={selectedTransation} />
                </div>
            }
            {/* delete */}
            {showDeleteForm &&
                <div className="form-modal">
                    <DeleteTransactionForm user={user} hideDeleteForm={hideDeleteForm} selected_transaction={selectedTransation} />
                </div>
            }

        </>
    )
}

export default Transactions