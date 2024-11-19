import React, { useState } from "react"
import { loginFormData, userObj } from "../../types"


interface loginProps {
  signUpStatus: () => void,
  updateUser: (u: userObj) => void
}

function LoginForm({ signUpStatus, updateUser }: loginProps) {
  const [formData, setFormData] = useState({ 'username': '', 'password': '' })
  const [formErrors, setFormErrors] = useState({ 'username': '', 'password': '', 'non_field_errors': '' })

  // login function
  async function handleSubmit(formData: loginFormData, event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault()

      const response = await fetch('http://localhost:8000/finance-api/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      console.log(response)

      const data = await response.json()

      // update user context/state with user & token
      if (data.token) {
        updateUser(data)
        return
      }

      // update form errors
      if (data.non_field_errors) {
        setFormErrors({ 'username': '', 'password': '', 'non_field_errors': data.non_field_errors[0] })
        return
      }

      setFormErrors({ 'password': data.password ? data.password : '', 'username': data.username ? data.username : '', 'non_field_errors': '' })

      return

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div>
        <form onSubmit={(e) => handleSubmit(formData, e)}>
          <h2>Login form</h2>

          {formErrors.non_field_errors && <p>{formErrors.non_field_errors}</p>}

          <div className={formErrors.username ? 'error formgroup' : 'formgroup'}>
            {formErrors.username && <span>{formErrors.username}</span>}
            <label htmlFor="username">Name</label>
            <input type="text" name="username" id="username" value={formData['username']} onInput={(e) => setFormData({ ...formData, 'username': e.currentTarget.value })} />
          </div>

          <div className={formErrors.password ? 'error formgroup' : 'formgroup'}>
            {formErrors.password && <span>{formErrors.password}</span>}
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={formData['password']} onInput={(e) => setFormData({ ...formData, 'password': e.currentTarget.value })} />
          </div>

          <button type="submit">login</button>

        </form>
        <button onClick={signUpStatus}>sign up</button>
      </div>

    </>
  )
}

export default LoginForm