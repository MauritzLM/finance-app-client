import { useState } from "react"
import { userObj, signupFormData } from "../../types"

interface signUpProps {
    loginStatus: () => void,
    updateUser: (u: userObj) => void
}

function SignUpForm({ loginStatus, updateUser }: signUpProps) {
    const [formData, setFormData] = useState<signupFormData>({ 'username': '', 'email': '', 'password': '' })
    const [formErrors, setFormErrors] = useState({ 'username': '', 'email': '', 'password': '' })

    // signup function
    async function handleSubmit(formData: signupFormData, event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const response = await fetch('http://localhost:8000/finance-api/users', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json()

            console.log(data)

            // update user context/state with user & token
            if (data.token) {
                updateUser(data)
                return
            }

            setFormErrors({ 'password': data.password ? data.password : '', 'username': data.username ? data.username : '', 'email': data.email ? data.email : '' })


        } catch (error) {
            console.log(error)
        }

    }

    return (
        <>
            <div>
                <form onSubmit={(e) => handleSubmit(formData, e)}>
                    <h2>Sign up form</h2>

                    <div className={formErrors.username ? 'error formgroup' : 'formgroup'}>
                        {formErrors.username && <span>{formErrors.username}</span>}
                        <label htmlFor="username">Name</label>
                        <input type="text" name="username" id="username" value={formData.username} onInput={e => setFormData({ ...formData, 'username': e.currentTarget.value })} />
                    </div>

                    <div className={formErrors.email ? 'error formgroup' : 'formgroup'}>
                        {formErrors.email && <span>{formErrors.email}</span>}
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onInput={e => setFormData({ ...formData, 'email': e.currentTarget.value })} />
                    </div>

                    <div className={formErrors.password ? 'error formgroup' : 'formgroup'}>
                        {formErrors.password && <span>{formErrors.password}</span>}
                        <label htmlFor="password">Create Password</label>
                        <input type="password" name="password" id="password" value={formData.password} onInput={e => setFormData({ ...formData, 'password': e.currentTarget.value })} />
                    </div>

                    <button type="submit">Create Account</button>
                </form>
                <button onClick={loginStatus}>login</button>
            </div>
        </>
    )
}

export default SignUpForm