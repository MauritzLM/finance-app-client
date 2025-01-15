import { useEffect, useState } from "react"
import { userObj, transaction } from "../types"
import { isPaid, isUpcoming, dueSoon, filterAndSortArr, formatDay } from "../helpers/helpers"
import '../assets/sass/recurring_bills.scss'

interface recurringBillsProps {
    user: userObj,
    recurringBills: transaction[],
    updateRecurringBills: (transactionArr: transaction[]) => void
}

function RecurringBills({ user, recurringBills, updateRecurringBills }: recurringBillsProps) {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortBy, setSortBy] = useState<string>('Latest')
    const [activeSelect, setActiveSelect] = useState(false)

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

    // toggle sort select
    function handleSelect() {
        if (activeSelect) {
            setActiveSelect(false)
        }

        else {
            setActiveSelect(true)
        }
    }

    function handleSort(s: string) {
        setSortBy(s)
        setActiveSelect(false)
    }

    useEffect(() => {
        if (!recurringBills.length) {
            getRecurringBills()
        }
    })

    return (
        <>
            <h1>Recurring Bills</h1>
            {/* total and summary */}
            {recurringBills.length &&
                <div className="row-1">

                    <div className="total">
                        <svg fill="none" height="28" viewBox="0 0 32 28" width="32" xmlns="http://www.w3.org/2000/svg"><path d="m24.4375 10.25c0 .2486-.0988.4871-.2746.6629s-.4143.2746-.6629.2746h-15c-.24864 0-.4871-.0988-.66291-.2746-.17582-.1758-.27459-.4143-.27459-.6629s.09877-.4871.27459-.66291c.17581-.17582.41427-.27459.66291-.27459h15c.2486 0 .4871.09877.6629.27459.1758.17581.2746.41431.2746.66291zm-.9375 4.0625h-15c-.24864 0-.4871.0988-.66291.2746-.17582.1758-.27459.4143-.27459.6629s.09877.4871.27459.6629c.17581.1758.41427.2746.66291.2746h15c.2486 0 .4871-.0988.6629-.2746s.2746-.4143.2746-.6629-.0988-.4871-.2746-.6629-.4143-.2746-.6629-.2746zm8.4375-11.5625v23.75c-.0002.1598-.0412.3168-.1191.4563-.078.1395-.1902.2567-.3262.3406-.1476.0921-.3182.1409-.4922.1406-.1453.0001-.2887-.0336-.4187-.0984l-4.5813-2.2907-4.5813 2.2907c-.13.0649-.2734.0987-.4187.0987s-.2887-.0338-.4187-.0987l-4.5813-2.2907-4.5813 2.2907c-.13.0649-.2734.0987-.4187.0987s-.2887-.0338-.4187-.0987l-4.5813-2.2907-4.58125 2.2907c-.14295.0713-.30178.105-.461388.0977-.159613-.0073-.314721-.0552-.450598-.1393-.135877-.084-.248016-.2014-.325769-.341-.077754-.1396-.1185428-.2967-.118495-.4565v-23.75c0-.58016.230468-1.13656.640704-1.5468.410236-.410232.966636-.6407 1.546796-.6407h27.5c.5802 0 1.1366.230468 1.5468.6407.4102.41024.6407.96664.6407 1.5468zm-1.875 0c0-.08288-.0329-.16237-.0915-.22097-.0586-.05861-.1381-.09153-.221-.09153h-27.5c-.08288 0-.16237.03292-.22097.09153-.05861.0586-.09153.13809-.09153.22097v22.2328l3.64375-1.8219c.13004-.0649.2734-.0987.41875-.0987s.28871.0338.41875.0987l4.58125 2.2907 4.5813-2.2907c.13-.0649.2734-.0987.4187-.0987s.2887.0338.4187.0987l4.5813 2.2907 4.5813-2.2907c.13-.0649.2734-.0987.4187-.0987s.2887.0338.4187.0987l3.6438 1.8219z" fill="#fff" /></svg>
                        <p>Total Bills</p>
                        <p data-testid="total">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                            {(Math.abs(recurringBills.reduce((a: number, c: transaction) => a + c.amount, 0)) / 100).toFixed(2)}</p>
                    </div>

                    {/* summary */}
                    <div className="summary">
                        <h2>Summary</h2>
                        <ul>
                            <li>
                                <span>Paid Bills</span>
                                {/* calculate amount* */}
                                <span data-testid="paid">{recurringBills.filter(isPaid).length} (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                    {(Math.abs(recurringBills.filter(isPaid).reduce((a, c) => a + c.amount, 0)) / 100).toFixed(2)} )</span>
                            </li>
                            <li>
                                <span>Total Upcoming</span>
                                {/* calculate amount* */}
                                <span data-testid="upcoming">{recurringBills.filter(isUpcoming).length} (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                    {(Math.abs(recurringBills.filter(isUpcoming).reduce((a, c) => a + c.amount, 0)) / 100).toFixed(2)} )</span>
                            </li>
                            <li>
                                <span>Due Soon</span>
                                {/* calculate amount* */}
                                <span>{recurringBills.filter(dueSoon).length} (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                    {(Math.abs(recurringBills.filter(dueSoon).reduce((a, c) => a + c.amount, 0)) / 100).toFixed(2)} )</span>
                            </li>
                        </ul>
                    </div>

                </div>
            }

            <div className="row-2">

                <div className="top-bar">
                    {/* search */}
                    <div className="search-bar">
                        <input data-testid="search" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.currentTarget.value)} placeholder="search bills" />
                        <button>
                            <svg fill="none" height="14" viewBox="0 0 14 14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m13.3538 13.1462-3.1294-3.1287c.907-1.08894 1.3593-2.48564 1.2628-3.89955-.0966-1.41391-.7345-2.73618-1.78109-3.69173-1.0466-.95555-2.42131-1.470821-3.83815-1.438621-1.41683.032201-2.76671.609391-3.76883 1.611501-1.00211 1.00212-1.579301 2.352-1.611501 3.76883-.0322 1.41684.483071 2.79155 1.438621 3.83817.95556 1.0466 2.27782 1.6845 3.69173 1.781 1.41391.0966 2.81061-.3557 3.89954-1.2627l3.12878 3.1293c.0464.0465.1016.0833.1623.1085.0607.0251.1257.0381.1914.0381s.1308-.013.1915-.0381c.0607-.0252.1158-.062.1623-.1085.0464-.0464.0833-.1016.1084-.1623.0252-.0607.0381-.1257.0381-.1914s-.0129-.1308-.0381-.1915c-.0251-.0607-.062-.1158-.1084-.1623zm-11.85378-6.64621c0-.89002.26392-1.76005.75839-2.50007.49446-.74002 1.19727-1.31679 2.01954-1.65739.82226-.34059 1.72706-.42971 2.59998-.25607.87291.17363 1.67473.60221 2.30407 1.23155s1.0579 1.43116 1.2316 2.30407c.1736.87292.0845 1.77772-.2561 2.59999-.34062.82226-.91739 1.52507-1.65741 2.01953-.74002.4945-1.61005.7584-2.50007.7584-1.19307-.0013-2.33689-.4759-3.18052-1.31949-.84363-.84363-1.31816-1.98745-1.31948-3.18052z" fill="#201f24" /></svg>
                        </button>
                    </div>

                    {/* custom sort select */}
                    <div className={activeSelect ? 'cs-active sort' : 'sort'}>
                        <span className="label">Sort by</span>
                        <button onClick={() => handleSelect()} role="combobox" id="sort-select" value="Select" aria-expanded={activeSelect} aria-controls="listbox-sort" aria-haspopup="listbox">
                            <span>{sortBy}</span>
                            <svg fill="none" height="20" viewBox="0 0 16 15" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m14.25 0h-12.5c-.33152 0-.64946.131696-.883884.366116-.23442.234421-.366116.552363-.366116.883884v12.5c0 .3315.131696.6495.366116.8839.234424.2344.552364.3661.883884.3661h12.5c.3315 0 .6495-.1317.8839-.3661s.3661-.5524.3661-.8839v-12.5c0-.331521-.1317-.649463-.3661-.883884-.2344-.23442-.5524-.366116-.8839-.366116zm-10.625 3.125h7.5c.1658 0 .3247.06585.4419.18306.1173.11721.1831.27618.1831.44194s-.0658.32473-.1831.44194c-.1172.11721-.2761.18306-.4419.18306h-7.5c-.16576 0-.32473-.06585-.44194-.18306s-.18306-.27618-.18306-.44194.06585-.32473.18306-.44194.27618-.18306.44194-.18306zm3.125 8.75h-3.125c-.16576 0-.32473-.0658-.44194-.1831-.11721-.1172-.18306-.2761-.18306-.4419s.06585-.3247.18306-.4419c.11721-.1173.27618-.1831.44194-.1831h3.125c.16576 0 .32473.0658.44194.1831.11721.1172.18306.2761.18306.4419s-.06585.3247-.18306.4419c-.11721.1173-.27618.1831-.44194.1831zm.625-3.75h-3.75c-.16576 0-.32473-.06585-.44194-.18306s-.18306-.27618-.18306-.44194.06585-.32473.18306-.44194.27618-.18306.44194-.18306h3.75c.16576 0 .32473.06585.44194.18306s.18306.27618.18306.44194-.06585.32473-.18306.44194-.27618.18306-.44194.18306zm6.0672 2.3172-1.875 1.875c-.0581.0581-.127.1042-.2029.1357-.0758.0314-.1572.0476-.2393.0476s-.1635-.0162-.2393-.0476c-.0759-.0315-.1448-.0776-.2029-.1357l-1.87499-1.875c-.11727-.1173-.18316-.2763-.18316-.4422 0-.16585.06589-.32491.18316-.44219.11728-.11727.27634-.18316.44219-.18316s.32491.06589.44219.18316l.80781.80859v-3.4914c0-.16576.0658-.32473.1831-.44194.1172-.11721.2761-.18306.4419-.18306s.3247.06585.4419.18306c.1173.11721.1831.27618.1831.44194v3.4914l.8078-.80859c.1173-.11727.2763-.18316.4422-.18316s.3249.06589.4422.18316c.1173.11728.1831.27634.1831.44219 0 .1659-.0658.3249-.1831.4422z" fill="#201f24" /></svg>
                        </button>

                        {/* dropdown */}
                        <ul role="listbox" id="listbox-sort">
                            <span>Sort by</span>
                            <li role="option" className={sortBy === 'Latest' ? 'cs-active' : ''} onClick={() => handleSort('Latest')}>Latest</li>
                            <li role="option" className={sortBy === 'Oldest' ? 'cs-active' : ''} onClick={() => handleSort('Oldest')}>Oldest</li>
                            <li role="option" className={sortBy === 'A-to-Z' ? 'cs-active' : ''} onClick={() => handleSort('A-to-Z')}>A to Z</li>
                            <li role="option" className={sortBy === 'Z-to-A' ? 'cs-active' : ''} onClick={() => handleSort('Z-to-A')}>Z to A</li>
                            <li role="option" className={sortBy === 'Highest' ? 'cs-active' : ''} onClick={() => handleSort('Highest')}>Highest</li>
                            <li role="option" className={sortBy === 'Lowest' ? 'cs-active' : ''} onClick={() => handleSort('Lowest')}>Lowest</li>
                        </ul>

                        <svg fill="none" height="6" viewBox="0 0 12 6" width="12" xmlns="http://www.w3.org/2000/svg"><path d="m11.3538.85375-5.00002 5c-.04644.04649-.10158.08337-.16228.10853s-.12576.03811-.19147.03811-.13077-.01295-.19147-.03811-.11585-.06204-.16228-.10853l-5.000002-5c-.070006-.069927-.11769-.159054-.137015-.256096-.019325-.097043-.009423-.197638.028453-.289049.037877-.091412.102024-.16953.18432-.224465.082297-.0549354.179044-.08421771.277994-.08413985h9.99997c.099-.00007786.1957.02920445.278.08413985.0823.054935.1465.133053.1843.224465.0379.091411.0478.192006.0285.289049-.0193.097042-.067.186169-.137.256096z" fill="#201f24" /></svg>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th scope="col">Bill Title</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recurringBills.length && filterAndSortArr(recurringBills, searchTerm, sortBy).map(t =>
                            <tr data-testid="bill" key={t.id}>
                                <td>
                                    <img src={t.avatar} alt="" height={32} width={32} loading="lazy" decoding="async" aria-hidden="true" />
                                    <span className="name">{t.name}</span>
                                </td>
                                <td data-testid="date">Monthly-{formatDay(new Date(t.date).toLocaleString('en-GB', { 'day': 'numeric' }))}
                                    {dueSoon(t) && <img src="./src/assets/images/icon-bill-due.svg"></img>}
                                    {isPaid(t) && <img src="./src/assets/images/icon-bill-paid.svg"></img>}
                                </td>
                                <td data-testid="amount" className={dueSoon(t) ? 'danger amount' : 'amount'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#201F24"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" /></svg>
                                    {(Math.abs(t.amount) / 100).toFixed(2)}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default RecurringBills