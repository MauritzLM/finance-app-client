import { describe, it, expect } from 'vitest'
import { isPaid, dueSoon, isUpcoming, filterAndSortArr, unusedCategories, formatTransaction, formatDay } from '../helpers'
import { transaction, budget } from '../../types'
import { categories } from '../../data/data';


// ispaid, duesoon, totalupcoming -> DEPENDS ON DAY*
describe('test isPaid, dueSoon, totalUpcoming and formatDay functions', () => {
    it('isPaid test', () => {
        const mockTransaction1: transaction = { 'amount': 15.00, 'avatar': '', 'category': 'Bills', 'date': '2024-08-02T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': true }
        const mockTransaction2: transaction = { 'amount': 15.00, 'avatar': '', 'category': 'Bills', 'date': '2024-07-29T10:05:42Z', 'id': 11, 'name': 'Peter', 'recurring': true }

        expect(isPaid(mockTransaction1)).toBe(true)
        expect(isPaid(mockTransaction2)).toBe(false)
    });

    it('dueSoon test', () => {
        const mockTransaction1: transaction = { 'amount': 15.00, 'avatar': '', 'category': 'Bills', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': true }
        const mockTransaction2: transaction = { 'amount': 15.00, 'avatar': '', 'category': 'Bills', 'date': '2024-07-05T10:05:42Z', 'id': 11, 'name': 'Peter', 'recurring': true }

        expect(dueSoon(mockTransaction1)).toBe(false)
        expect(dueSoon(mockTransaction2)).toBe(true)
    });

    it('isUpcoming test', () => {
        const mockTransaction1: transaction = { 'amount': 15.00, 'avatar': '', 'category': 'Bills', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': true }
        const mockTransaction2: transaction = { 'amount': 15.00, 'avatar': '', 'category': 'Bills', 'date': '2024-07-30T10:05:42Z', 'id': 11, 'name': 'Peter', 'recurring': true }

        expect(isUpcoming(mockTransaction1)).toBe(false)
        expect(isUpcoming(mockTransaction2)).toBe(true)
    });

    it('formatDay test', () => {
        expect(formatDay('1')).toMatch('1st')
        expect(formatDay('23')).toMatch('23rd')
        expect(formatDay('11')).toMatch('11th')
        expect(formatDay('2')).toMatch('2nd')
    });
});

// filter and sort arr
describe('test filterAndSortArr function', () => {
    // setup
    const test_arr: transaction[] = [{ 'amount': 18.50, 'avatar': '', 'category': 'Bills', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': true },
    { 'amount': 17.00, 'avatar': '', 'category': 'Bills', 'date': '2024-08-02T09:25:11Z', 'id': 12, 'name': 'Tom', 'recurring': true },
    { 'amount': 30.00, 'avatar': '', 'category': 'Bills', 'date': '2024-07-30T10:05:42Z', 'id': 11, 'name': 'Peter', 'recurring': true },]


    it('no search term and no sort string returns same array', () => {
        expect(filterAndSortArr(test_arr, '', '')).toEqual(test_arr)
    });

    it('test sort by oldest', () => {
        expect(filterAndSortArr(test_arr, '', 'Oldest')[0]['name']).toBe('Peter')
    });

    it('test sort by A-Z', () => {
        expect(filterAndSortArr(test_arr, '', 'A-to-Z')[2]['name']).toBe('Tom')
    });

    it('test sort by Z-A', () => {
        expect(filterAndSortArr(test_arr, '', 'Z-to-A')[2]['name']).toBe('Daniel')
    });

    it('test sort by highest', () => {
        expect(filterAndSortArr(test_arr, '', 'Highest')[0]['name']).toBe('Peter')
    })

    it('test sort by lowest', () => {
        expect(filterAndSortArr(test_arr, '', 'Lowest')[0]['name']).toBe('Tom')
    })

    it('test search', () => {
        expect(filterAndSortArr(test_arr, 'e', '').length).toEqual(2)
        expect(filterAndSortArr(test_arr, 'tom', '').length).toEqual(1)
        expect(filterAndSortArr(test_arr, 'stan', '').length).toEqual(0)
    })
});

// unused categories
describe('test unusedCategories function', () => {

    const test_budgets: budget[] = [{ 'id': 1, 'category': 'Bills', 'maximum': 500.00, 'theme': '#fff' }, { 'id': 2, 'category': 'Education', 'maximum': 250.00, 'theme': '#1f3' }]
    
    it('test function removes used categories', () => {
        const newArr: string[] = unusedCategories(categories, test_budgets)
        expect(newArr.includes('Bills')).toBe(false)
        expect(newArr.includes('Education')).toBe(false)
        expect(newArr.includes('Personal Care')).toBe(true)
    });
});

// unused themes

// round percentage

// format transaction
describe('test formatTransaction', () => {
    const testTransaction1: transaction = { 'amount': -18.50, 'avatar': '', 'category': 'Bills', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': true }
    const testTransaction2: transaction = { 'amount': 18.50, 'avatar': '', 'category': 'Bills', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': true }

    it('test function formats - and  + numbers correctly', () => {
        expect(formatTransaction(testTransaction1.amount.toString())).toEqual('-$18.50')
        expect(formatTransaction(testTransaction2.amount.toString())).toEqual('+$18.50')
    })
})