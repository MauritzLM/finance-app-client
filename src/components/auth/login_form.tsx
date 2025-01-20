import React, { useState } from "react"
import { loginFormData, userObj } from "../../types"

interface loginProps {
  signUpStatus: () => void,
  updateUser: (u: userObj) => void
}

function LoginForm({ signUpStatus, updateUser }: loginProps) {
  const [formData, setFormData] = useState({ 'username': '', 'password': '' })
  const [formErrors, setFormErrors] = useState({ 'username': '', 'password': '', 'non_field_errors': '' })
  const [showPassword, setShowPassword] = useState(false)

  // login function
  async function handleSubmit(formData: loginFormData, event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault()

      const response = await fetch('https://web-production-de787.up.railway.app/finance-api/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      // update user context/state with user & token
      if (data.token) {
        updateUser(data)
        localStorage.setItem('user', JSON.stringify(data))
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

  function togglePassword() {
    if (showPassword) {
      setShowPassword(false)
      return
    }

    setShowPassword(true)
  }

  return (
    <>

      <div className="illustration">
        <img src="/images/logo-large.svg" alt="" aria-hidden="true" decoding="async" loading="eager" />

        <div>
          <h1>Keep track of your money <br />
            and save for your future</h1>
          <p>Personal finance app puts you in control of your spending. Track <br /> transactions, set budgets, and add to savings pots easily.</p>
        </div>
      </div>

      <div className="form-wrapper">
        <form onSubmit={(e) => handleSubmit(formData, e)}>
          <h2>Login</h2>

          {formErrors.non_field_errors && <p>{formErrors.non_field_errors}</p>}

          <div className={formErrors.username ? 'error form-group' : 'form-group'}>
            {formErrors.username && <span>{formErrors.username}</span>}
            <label htmlFor="username">Name</label>
            <input type="text" name="username" id="username" value={formData['username']} onInput={(e) => setFormData({ ...formData, 'username': e.currentTarget.value })} />
          </div>

          <div className={formErrors.password ? 'error form-group' : 'form-group'}>
            {formErrors.password && <span>{formErrors.password}</span>}
            <label htmlFor="password">Password</label>
            <input type={showPassword ? 'text' : 'password'} name="password" id="password" value={formData['password']} onInput={(e) => setFormData({ ...formData, 'password': e.currentTarget.value })} />
            <button type="button" onClick={togglePassword}>
              {showPassword ? <svg fill="none" height="12" viewBox="0 0 16 12" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m6.04249 1.61686c-.02952-.03235-.05003-.07189-.05948-.11466-.00944-.04276-.00748-.08726.00569-.12903.01316-.04178.03707-.07936.06933-.10898.03225-.02963.07173-.05026.11446-.05983.59947-.13707 1.21257-.205631 1.8275-.204379 2.18001 0 4.16061.828749 5.72871 2.396879 1.1769 1.17687 1.7063 2.35125 1.7282 2.40062.0284.06395.0431.13315.0431.20313s-.0147.13918-.0431.20312c-.0219.04938-.5513 1.22313-1.7282 2.4-.1783.1775-.3614.34563-.5493.50438-.0495.04197-.1133.06309-.178.0589-.0647-.0042-.1253-.03339-.1689-.0814zm7.32751 9.54684c.0451.0485.0801.1054.103.1674.023.0621.0334.1281.0306.1942s-.0186.131-.0467.1909c-.028.06-.0676.1137-.1166.1582s-.1063.0789-.1686.1011-.1285.0317-.1945.0282c-.0661-.0036-.1308-.0202-.1904-.0489-.0596-.0288-.1129-.0691-.1568-.1186l-1.38-1.5156c-1.0234.4527-2.13093.6842-3.25001.6794-2.18 0-4.16062-.8288-5.72875-2.39627-1.17687-1.17687-1.708746-2.35062-1.728121-2.4-.028429-.06394-.043119-.13314-.043119-.20312s.01469-.13918.043119-.20313c.019375-.0475.551251-1.22375 1.728121-2.40062.47018-.47235.99467-.88733 1.5625-1.23625l-1.20375-1.324379c-.04508-.048429-.0801-.105324-.10303-.167388-.02294-.062064-.03332-.128063-.03056-.194171.00276-.066107.01862-.13101.04665-.190944.02803-.059935.06767-.113711.11664-.15821.04896-.0444996.10628-.0788379.16861-.1010248.06233-.02218694.12845-.03178117.19452-.02822675.06607.00355443.13078.02018695.19037.04893335.0596.0287465.11289.0690352.1568.1185312zm-4.09313-3.01559-3.29313-3.625c-.33933.46493-.50783 1.03272-.47706 1.60749.03078.57478.25894 1.12132.64598 1.54737.38704.42604.90924.70548 1.47843.79113.56919.08566 1.1505-.02772 1.64578-.32099z" fill="#252623" /></svg> : <svg fill="none" height="10" viewBox="0 0 16 10" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m15.4569 4.7975c-.0219-.04937-.5513-1.22375-1.7282-2.40063-1.5681-1.56812-3.5487-2.39687-5.72871-2.39687-2.18 0-4.16062.82875-5.72875 2.39687-1.17687 1.17688-1.708746 2.35313-1.728121 2.40063-.028429.06394-.043119.13314-.043119.20312s.01469.13918.043119.20313c.021875.04937.551251 1.22313 1.728121 2.4 1.56813 1.5675 3.54875 2.39625 5.72875 2.39625 2.18001 0 4.16061-.82875 5.72871-2.39625 1.1769-1.17687 1.7063-2.35063 1.7282-2.4.0284-.06395.0431-.13315.0431-.20313s-.0147-.13918-.0431-.20312zm-7.45691 2.7025c-.49445 0-.9778-.14662-1.38892-.42133-.41112-.2747-.73156-.66515-.92077-1.12196-.18922-.45682-.23873-.95948-.14227-1.44444.09646-.48495.33457-.93041.6842-1.28004s.79509-.58773 1.28004-.68419c.48495-.09647.98762-.04696 1.44443.14226.45682.18922.84726.50965 1.122.92077.2747.41113.4213.89448.4213 1.38893 0 .66304-.2634 1.29893-.73224 1.76777s-1.10472.73223-1.76777.73223z" fill="#252623" /></svg>}
            </button>
          </div>

          <button type="submit">login</button>

        </form>
        <p>Need to create an account? <button onClick={signUpStatus}>Sign Up</button></p>

      </div>

    </>
  )
}

export default LoginForm