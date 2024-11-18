import { Link } from "react-router-dom"


function Navbar() {
   
    return (
        <>
        <nav>
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