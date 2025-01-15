import { useState } from "react";
import LoginForm from "./login_form";
import SignUpForm from "./signup_form";
import { userObj } from "../../types";

interface authProps {
    updateUser: (u: userObj) => void
}

function Auth({ updateUser }: authProps) {
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
            <div className="auth-container">
                <div className="logo">
                    <img src="./src/assets/images/logo-large.svg" alt="" />
                </div>
                <LoginForm signUpStatus={signUpStatus} updateUser={updateUser} />
            </div>
        )
    }

    return (
        <div className="auth-container">
            <div className="logo">
                <img src="./src/assets/images/logo-large.svg" alt="" />
            </div>
            <SignUpForm loginStatus={loginStatus} updateUser={updateUser} />
        </div>
    )
}

export default Auth