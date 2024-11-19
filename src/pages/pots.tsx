import { userObj } from "../types"

interface potsProps {
    user: userObj
}

function Pots({ user }: potsProps) {
    return (
        <>
            <h1>Pots page</h1>
        </>
    )
}

export default Pots