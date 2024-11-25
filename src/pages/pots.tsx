import { useEffect } from "react"
import { userObj, pot } from "../types"

interface potsProps {
    user: userObj,
    pots: pot[],
    updatePots: (potArr: pot[]) => void
}

function Pots({ user, pots, updatePots }: potsProps) {
    // fetch pots if not in state
    async function getPots() {
         try {
            const response = await fetch('http://localhost:8000/finance-api/pots', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `token ${user['token']}`
                },
            })

            const data = await response.json()
 
            updatePots(data)

         } catch (error) {
            console.log(error)
         }    
    }

    useEffect(() => {
        if(!pots.length) {
            getPots()
        }
    })

    return (
        <>
            <h1>Pots</h1>  
            <button>+ Add New Pot</button>

            {/* create pot card for each pot */}

            <div className="pots-container">
                {pots?.map(pot =>
                    <div key={pot.name} className="pot-card">
                        <div>
                            <h2>{pot.name}</h2><button></button>
                        </div>

                        <div>
                            <div>
                                <span>Total Saved</span><span>${pot.total}</span>
                            </div>
                            <div className="progress-bar"></div>
                            <div>
                                <span>{(pot.total / pot.target) * 100}%</span><span>Target of ${pot.target}</span>
                            </div>
                        </div>

                        {/* how to display and populate forms?* */}
                        <div>
                            <button>+ Add Money</button>
                            <button>Withdraw Money</button>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

export default Pots