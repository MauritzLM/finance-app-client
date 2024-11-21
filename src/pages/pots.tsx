import { userObj, pot } from "../types"

interface potsProps {
    user: userObj,
    pots: pot[]
}

function Pots({ user, pots }: potsProps) {
    // fetch pots if not in state*
    return (
        <>
            <h1>Pots</h1>  
            <button>+ Add New Pot</button>

            {/* create pot card for each pot */}

            <div className="pots-container">
                {pots?.map(pot =>
                    <div className="pot-card">
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