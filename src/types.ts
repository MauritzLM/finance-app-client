export interface loginFormData {
    username: string,
    password: string
}

export interface signupFormData {
    name: string,
    email: string,
    password: string
}

export interface userObj {
    user: {'id': number, 'username': string},
    token: string
}