import { transaction, budget, stringOrNumberObj } from "../types"

// paid
export function isPaid(item: transaction) {
    const today: string = new Date().toLocaleDateString('en-GB', { 'day': 'numeric' })
    const due_date: string = new Date(item.date).toLocaleDateString('en-GB', { 'day': 'numeric' })

    if (Number(today) >= Number(due_date)) {
        return true
    }

    return false
}

// is upcoming
export function isUpcoming(item: transaction) {
    const today: string = new Date().toLocaleDateString('en-GB', { 'day': 'numeric' })
    const due_date: string = new Date(item.date).toLocaleDateString('en-GB', { 'day': 'numeric' })

    if (Number(today) < Number(due_date)) {
        return true
    }

    return false
}

// due soon
export function dueSoon(item: transaction) {
    const today: string = new Date().toLocaleDateString('en-GB', { 'day': 'numeric' })
    const due_date: string = new Date(item.date).toLocaleDateString('en-GB', { 'day': 'numeric' })
    const difference: number = Number(due_date) - Number(today)

    if (difference > 0 && difference <= 5) {
        return true
    }

    return false
}

// filter and sort for recurring bills
export function filterAndSortArr(currentArr: transaction[], search: string, sort: string) {
    let newArr = []
    // show all if no search term
    if (search === '') {
        newArr = [...currentArr]
    }

    else {
        newArr = currentArr.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    // sort according to sortby
    // oldest
    if (sort === 'Oldest') {
        return newArr.sort((a, b) => {
            // only compare day
            const dateA = new Date(a.date).toLocaleString('en-GB', { 'day': 'numeric' })
            const dateB = new Date(b.date).toLocaleString('en-GB', { 'day': 'numeric' })

            if (dateA > dateB) {
                return -1
            }

            if (dateB > dateA) {
                return 1
            }

            return 0

        })
    }
    
    // latest
    if (sort === 'Latest') {
        return newArr.sort((a, b) => {
            // only compare day
            const dateA = new Date(a.date).toLocaleString('en-GB', { 'day': 'numeric' })
            const dateB = new Date(b.date).toLocaleString('en-GB', { 'day': 'numeric' })

            if (dateA > dateB) {
                return 1
            }

            if (dateB > dateA) {
                return -1
            }

            return 0

        })
    }

    // A-Z
    if (sort === 'A-to-Z') {
        return newArr.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()

            if (nameA > nameB) {
                return 1
            }

            if (nameB > nameA) {
                return -1
            }

            return 0
        })
    }

    // Z-A
    if (sort === 'Z-to-A') {
        return newArr.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()

            if (nameA > nameB) {
                return -1
            }

            if (nameB > nameA) {
                return 1
            }

            return 0
        })
    }

    // Highest
    if (sort === 'Highest') {
        return newArr.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    }

    // Lowest
    if (sort === 'Lowest') {
        return newArr.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount))
    }

    return newArr
}

// create an unused categories arr
export function unusedCategories(categories: string[], budgets: budget[]) {

    // array for categories to exclude
    const newArr: string[] = []

    for (let i = 0; i < budgets.length; i++) {
        newArr.push(budgets[i].category)
    }

    return categories.filter(el => newArr.includes(el) === false)
}

// create an unused themes array
export function unusedThemes(themes: string[], arr: stringOrNumberObj[]) {
    const newArr: string[] = []

    for (let i = 0; i < arr.length; i++) {
        newArr.push(arr[i].theme)
    }

    return themes.filter(el => newArr.includes(el) === false)
}

// round percentage
export function roundPercentage(num: number) {
    return Math.round(num * 100) / 100
}

// format transaction amount
export function formatTransaction(t: string) {
    if (t.startsWith('-')) {
        const newT = t.replace('-', '$')

        return '-' + newT
    }

    else {
        const newT = t.replace('+', '$')

        return '+' + newT
    }
}
