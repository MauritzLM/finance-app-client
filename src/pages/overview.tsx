import { userObj } from "../types"

interface overviewProps {
    user: userObj
}

function Overview({ user }: overviewProps) {
    return (
        <>
            <h1>Overview page</h1>
        </>
    )
}

export default Overview