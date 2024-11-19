import { userObj } from "../types"

interface transactionsProps {
    user: userObj
}

function Transactions({ user }: transactionsProps) {
    return (
        <>
            <h1>Transactions page</h1>
        </>
    )
}

export default Transactions