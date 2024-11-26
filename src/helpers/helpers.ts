import { transaction } from "../types"
// compare the days of two dates
// paid
export function isPaid(item: transaction) {
    const today: string = new Date().toLocaleDateString('en-GB', { 'day': 'numeric' })
    const due_date: string = new Date(item.date).toLocaleDateString('en-GB', { 'day': 'numeric' })

    if (Number(today) >= Number(due_date)) {
        return true
    }

    return false
}

// total upcoming
export function totalUpcoming(item: transaction) {
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

// filter
export function filterAndSortArr(currentArr: transaction[], search: string, sort: string) {
    let newArr = []
    // show all if no search term
    if (search === '') {
        newArr = [...currentArr]
    }

    else {
        newArr = currentArr.filter(item => item.name.toLowerCase().includes(search))
    }

    // sort according to sortby
    // oldest
    if (sort === 'Oldest') {
        return newArr.sort((a, b) => {
            const dateA = new Date(a.date).toLocaleString('en-GB', { 'year': 'numeric', 'month': 'short', 'day': 'numeric' })
            const dateB = new Date(b.date).toLocaleString('en-GB', { 'year': 'numeric', 'month': 'short', 'day': 'numeric' })

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
        return newArr.sort((a, b) => a.amount - b.amount)
    }

    // Lowest
    if (sort === 'Lowest') {
        return newArr.sort((a, b) => b.amount - a.amount)
    }

    return newArr
}