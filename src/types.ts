export interface loginFormData {
    username: string,
    password: string
}

export interface signupFormData {
    username: string,
    email: string,
    password: string
}

export interface userObj {
    user: { 'id': number, 'username': string },
    token: string
}

export interface budget {
    id: number,
    category: string,
    maximum: number,
    theme: string
}

export interface transaction {
    amount: number,
    avatar: string,
    category: string,
    date: string,
    id: number,
    name: string,
    recurring: boolean
}

export interface pot {
    id: number,
    name: string,
    target: number,
    theme: string,
    total: number
}

export interface budget_spending {
    [key: string]: number
}

export interface overviewData {
    budgets: budget[],
    expenses: transaction[],
    income: transaction[],
    pots: pot[],
    recent_transactions: transaction[],
    recurring_bills: transaction[],
    budget_spending: budget_spending,
}