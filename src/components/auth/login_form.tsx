import { useState } from "react"
import { loginFormData } from "../../types"


interface loginProps {
  signUpStatus: () => void
}

function LoginForm({ signUpStatus }: loginProps) {
  const [formData, setFormData] = useState({ 'email': '', 'password': '' })
  
  // login function
  async function handleSubmit(formData: loginFormData) {
    try {
        const repsonse = await fetch('http://localhost:8000/finance-api/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        const data = await repsonse.json()

        // update user context/state with user & token*

    } catch (error) {
        console.log(error)
    }
}
  return (
    <>
      <div>
        <form onSubmit={() => handleSubmit(formData)}>
          <h2>Login form</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={formData['email']} onInput={(e) => setFormData({ ...formData, 'email': e.currentTarget.value })} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={formData['password']} onInput={(e) => setFormData({ ...formData, 'password': e.currentTarget.value })} />
          </div>

          <button type="submit">login</button>

        </form>
        <button onClick={signUpStatus}>sign up</button>
      </div>

    </>
  )
}

export default LoginForm