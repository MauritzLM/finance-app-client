import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import RecurringBills from '../recurring_bills'
import { userObj, transaction } from '../../types'
import userEvent from '@testing-library/user-event'



// mocks
const fetchMock = vi.fn();
fetchMock.mockReturnValue(
    Promise.resolve({
        json: () => Promise.resolve({})
    }),
);
vi.stubGlobal('fetch', fetchMock);
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }
const mockBills: transaction[] = [{ 'amount': -18.50, 'avatar': '', 'category': 'Bills', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': true },
{ 'amount': -17.00, 'avatar': '', 'category': 'Bills', 'date': '2024-08-02T09:25:11Z', 'id': 11, 'name': 'Tom', 'recurring': true },
{ 'amount': -30.00, 'avatar': '', 'category': 'Education', 'date': '2024-07-30T10:05:42Z', 'id': 12, 'name': 'Peter', 'recurring': true }]

// total bills, total paid text content, bill list, search and sort

describe('test recurring bills component', () => {
    
    it('test correct total displayed', () => {
        render(<BrowserRouter><RecurringBills user={mockUser} recurringBills={mockBills} updateRecurringBills={vi.fn()} /></BrowserRouter>)

        expect(screen.getByTestId('total')).toHaveTextContent('$65.50')
    });

    it('test correct summary values', () => {
        render(<BrowserRouter><RecurringBills user={mockUser} recurringBills={mockBills} updateRecurringBills={vi.fn()} /></BrowserRouter>)
        
        expect(screen.getByTestId('paid')).toHaveTextContent('2 ($35.50)')
        expect(screen.getByTestId('upcoming')).toHaveTextContent('1 ($30.00)')
    });

    it('test initial bill list', () => {
        render(<BrowserRouter><RecurringBills user={mockUser} recurringBills={mockBills} updateRecurringBills={vi.fn()} /></BrowserRouter>)

        const bill_list = screen.getAllByTestId('bill')
        const amounts = screen.getAllByTestId('amount')
        const dates = screen.getAllByTestId('date')

        expect(bill_list.length).toEqual(3)
        expect(amounts[2]).toHaveTextContent('$30.00')
        expect(dates[0].textContent).toMatch('Monthly-1st')
        expect(dates[0].textContent).toMatch('Monthly-2nd')
    });

    it('test user search', async () => {
        render(<BrowserRouter><RecurringBills user={mockUser} recurringBills={mockBills} updateRecurringBills={vi.fn()} /></BrowserRouter>)
        
        const user = userEvent.setup()
    
        const search_bar = screen.getByTestId('search')

        await user.type(search_bar, 'tom')

        const bill_list = await screen.findAllByTestId('bill')
        expect(bill_list.length).toBe(1)
    });

    // sort
    it('test user sort', async () => {
        render(<BrowserRouter><RecurringBills user={mockUser} recurringBills={mockBills} updateRecurringBills={vi.fn()} /></BrowserRouter>)
        
        const user = userEvent.setup()
    
        const sortOptions = screen.getByRole('combobox')

        await user.selectOptions(sortOptions, 'A to Z')

        const amounts = await screen.findAllByTestId('amount')
        expect(amounts.length).toBe(3)
        expect(amounts[2].textContent).toMatch('$17.00')
    });
});