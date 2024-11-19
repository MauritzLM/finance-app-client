import { useState } from "react";
import LoginForm from "./login_form";
import SignUpForm from "./signup_form";
import { userObj } from "../../types";

interface authProps {
    updateUser: (u: userObj) => void
}

function Auth({updateUser}: authProps) {
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
                <LoginForm signUpStatus={signUpStatus} updateUser={updateUser}/>
            </div>
        )
    }

    return (
        <div>
            <SignUpForm loginStatus={loginStatus} updateUser={updateUser}/>
        </div>
    )
}

export default Auth