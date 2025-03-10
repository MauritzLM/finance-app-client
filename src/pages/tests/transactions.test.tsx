import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import Transactions from '../transactions'
import { userObj, transaction } from '../../types'


// mocks
const mockBills: transaction[] = [{ 'amount': -1850, 'avatar': '', 'category': 'Bills', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': true },
{ 'amount': -1700, 'avatar': '', 'category': 'Bills', 'date': '2024-08-02T09:25:11Z', 'id': 11, 'name': 'Tom', 'recurring': true },
{ 'amount': -3000, 'avatar': '', 'category': 'Education', 'date': '2024-07-30T10:05:42Z', 'id': 12, 'name': 'Peter', 'recurring': true }]

const fetchMock = vi.fn();
fetchMock.mockReturnValue(
    Promise.resolve({
        json: () => Promise.resolve({
            'page_list': [{ 'amount': 1850, 'avatar': '', 'category': 'Education', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': false },
            { 'amount': -1700, 'avatar': '', 'category': 'Bills', 'date': '2024-08-02T09:25:11Z', 'id': 11, 'name': 'Tom', 'recurring': true },
            { 'amount': 3000, 'avatar': '', 'category': 'Education', 'date': '2024-07-30T10:05:42Z', 'id': 12, 'name': 'Peter', 'recurring': false },
            ],
            'num_pages': 3
        }),
    }),
);
vi.stubGlobal('fetch', fetchMock);
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }


// test transaction list, amount / date formatting, number of page buttons
describe('test transactions component', () => {
    it('renders transactions list', async () => {
        render(<BrowserRouter><Transactions user={mockUser} recurringBills={mockBills} updateRecurringBills={vi.fn()} /></BrowserRouter>)

        const transactions = await screen.findAllByTestId('transaction')

        expect(transactions).toHaveLength(3)
    });

    // it('renders correct page buttons', async () => {
    //     act(() => {
    //         render(<BrowserRouter><Transactions user={mockUser} /></BrowserRouter>)
    //     })

    //     // how to get after update?*
    //     const page_buttons = await screen.findAllByTestId('page-btn')

    //     expect(page_buttons).toHaveLength(3)
    // })

    it('correct date and amount format', async () => {
        render(<BrowserRouter><Transactions user={mockUser} recurringBills={mockBills} updateRecurringBills={vi.fn()} /></BrowserRouter>)

        const dates = await screen.findAllByTestId('date')

        expect(dates[0].textContent).toMatch('1 Aug 2024')
        expect(dates[2].textContent).toMatch('30 Jul 2024')

        const amounts = await screen.findAllByTestId('amount')

        expect(amounts[0].textContent).toMatch('$18.50')
        expect(amounts[1].textContent).toMatch('-$17.00')
    });
});