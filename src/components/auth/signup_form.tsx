import { userObj } from "../../types"

interface signUpProps {
    loginStatus: () => void,
    updateUser: (u: userObj) => void
}

function SignUpForm({ loginStatus, updateUser }: signUpProps) {

    // signup function*

    return (
        <>
            <div>
                <form>
                    <h2>Sign up form</h2>

                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="name" name="name" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Create Password</label>
                        <input type="password" name="password" />
                    </div>

                    <button type="submit">Create Account</button>
                </form>
                <button onClick={loginStatus}>login</button>
            </div>
        </>
    )
}

export default SignUpForm