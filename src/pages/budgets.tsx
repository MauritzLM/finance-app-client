import { userObj } from "../types"

interface budgetProps {
    user: userObj
}
function Budgets({ user }: budgetProps) {

    return (
        <>
            <h1>Budgets page</h1>
        </>
    )
}

export default Budgets