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
    [index: string]: number | string;
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
    [index: string]: number | string;
    id: number,
    name: string,
    target: number,
    theme: string,
    total: number
}

export interface budget_spending {
    [key: string]: number
}

export interface latest_budget_spending {
    [key: string]: transaction[]
}

export interface budgetForm {
    category: string,
    maximum: number,
    theme: string,
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


export interface stringOrNumberObj {
    [index: string]: number | string;
    theme: string;
}

export interface strObj {
    [index: string]: string
}
