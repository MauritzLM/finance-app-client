import { Link } from "react-router-dom"
import { userObj } from "../types"

interface navProps {
    user: userObj
}


function Navbar({user}: navProps) {
   
    return (
        <>
        <nav>
            {user.user.username && <p>Hello {user.user.username}</p>}
            <ul>
                <li><Link to="/">Overview</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
                <li><Link to="/budgets">Budgets</Link></li>
                <li><Link to="/pots">Pots</Link></li>
                <li><Link to="/recurring-bills">Recurring Bills</Link></li>
            </ul> 
        </nav> 
        </>
    )
}

export default Navbar