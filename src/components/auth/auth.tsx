import { useState } from "react";
import LoginForm from "./login_form";
import SignUpForm from "./signup_form";

function Auth() {
    const [loginState, setLoginState] = useState(true)

    function signUpStatus() {
        setLoginState(false)
    }

    function loginStatus() {
        setLoginState(true)
    }

    // signup function

    if (loginState) {
        return (
            <div>
                <LoginForm signUpStatus={signUpStatus}/>
            </div>
        )
    }

    return (
        <div>
            <SignUpForm loginStatus={loginStatus} />
        </div>
    )
}

export default Auth