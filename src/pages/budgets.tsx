import { userObj, budget, budget_spending } from "../types"

interface budgetProps {
    user: userObj,
    budgets: budget[],
    budgetSpending: budget_spending
}

function Budgets({ user, budgets, budgetSpending }: budgetProps) {

    // fetch latest spending*

    // fetch budgets and spending if not in props

    return (
        <>
            <h1>Budgets</h1>
            <button>+ Add New Budget</button>

            {/* summary */}
            {budgets.length > 0 &&
                <div>
                    <div className="budgets-summary">

                        <span>{Math.abs(Object.values(budgetSpending).reduce((a, c) => a + c, 0))}</span>
                        <span>of {budgets.reduce((a, c) => a + c.maximum, 0)} limit</span>

                        <h2>Spending Summary</h2>

                        <ul>
                            {budgets.map(budget =>
                                <li>
                                    <span>{budget.category}</span>
                                    <span>{Math.abs(budgetSpending[budget.category])} of {budget.maximum}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                    {/* list */}
                    <div className="budgets-detail">

                        {budgets.map(budget =>
                            <div>
                                <h2>{budget.category}</h2>
                                <button></button>
                                <p>maximum of {budget.maximum}</p>
                                <div>
                                    <div>
                                        <span>Spent</span>
                                        <span>{Math.abs(budgetSpending[budget.category])}</span>
                                    </div>
                                    <div>
                                        <span>Remaining</span>
                                        <span>{budget.maximum - Math.abs(budgetSpending[budget.category])}</span>
                                    </div>

                                </div>
                                {/* include latest spending* */}
                            </div>
                        )
                        }
                    </div>
                </div>
            }

        </>
    )
}

export default Budgets