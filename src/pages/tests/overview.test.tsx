import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import Overview from '../overview'
import { userObj } from '../../types'

// mocks
const fetchMock = vi.fn();
fetchMock.mockReturnValue(
    Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
            'pots': [{ 'id': 100, 'name': 'Vacation', 'total': 5000, 'target': 15000, 'theme': '#FFF' }, { 'id': 101, 'name': 'Savings', 'total': 15000, 'target': 55000, 'theme': '#AAA' },
            { 'id': 111, 'name': 'Gift', 'total': 4050, 'target': 8000, 'theme': '#EEE' }, { 'id': 125, 'name': 'New Laptop', 'total': 12000, 'target': 40000, 'theme': '#3A3' },
            { 'id': 241, 'name': 'Concert Ticket', 'total': 3500, 'target': 4500, 'theme': '#D4A' }],
            'budgets': [{ 'id': 1, 'category': 'Bills', 'maximum': 50000, 'theme': '#FFF' }, { 'id': 2, 'category': 'Education', 'maximum': 25000, 'theme': '#1f3' }],
            'income': [{ 'amount': 23000, 'avatar': '', 'category': 'Education', 'date': '2024-07-30T10:05:42Z', 'id': 12, 'name': 'Peter', 'recurring': false },
            { 'amount': 7000, 'avatar': '', 'category': 'General', 'date': '2024-08-14T10:05:42Z', 'id': 112, 'name': 'Ryu', 'recurring': false }
            ],
            'expenses': [{ 'amount': -1725, 'avatar': '', 'category': 'Bills', 'date': '2024-08-02T09:25:11Z', 'id': 11, 'name': 'Tom', 'recurring': true },
            { 'amount': -20030, 'avatar': '', 'category': 'General', 'date': '2024-07-12T09:25:11Z', 'id': 21, 'name': 'Makro', 'recurring': false }],
            'recent_transactions': [
                { 'amount': 1850, 'avatar': '', 'category': 'Education', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': false },
                { 'amount': -1700, 'avatar': '', 'category': 'Bills', 'date': '2024-08-02T09:25:11Z', 'id': 11, 'name': 'Tom', 'recurring': true },
                { 'amount': 3000, 'avatar': '', 'category': 'Education', 'date': '2024-07-30T10:05:42Z', 'id': 12, 'name': 'Peter', 'recurring': false }
            ],
            'recurring_bills': [{ 'amount': -1700, 'avatar': '', 'category': 'Bills', 'date': '2024-08-01T09:25:11Z', 'id': 11, 'name': 'Tom', 'recurring': true },
            { 'amount': -2300, 'avatar': '', 'category': 'Bills', 'date': '2024-08-31T09:25:11Z', 'id': 15, 'name': 'David', 'recurring': true }],
            'budget_spending': { 'Bills': 40050, 'Education': 10000 }
        }),
    }),
);
vi.stubGlobal('fetch', fetchMock);
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }

describe('overview component tests', () => {
    // current balance, income expenses
    it('test balance, income and expenses values', async () => {
        render(<BrowserRouter><Overview user={mockUser} updateBudgets={vi.fn()} isAuthenticated={true} updateAuthStatus={vi.fn()} updatePots={vi.fn()} updateBudgetSpending={vi.fn()} updateRecurringBills={vi.fn()} /></BrowserRouter>)

        const income = await screen.findByTestId('income')
        const expenses = await screen.findByTestId('expenses')
        const balance = await screen.findByTestId('balance')

        expect(income.textContent).toMatch('300.00')
        expect(expenses.textContent).toMatch('217.55')
        expect(balance.textContent).toMatch('82.45')
    });

    // pots
    it('test pot section values and rendering', async () => {
        render(<BrowserRouter><Overview user={mockUser} updateBudgets={vi.fn()} isAuthenticated={true} updateAuthStatus={vi.fn()} updatePots={vi.fn()} updateBudgetSpending={vi.fn()} updateRecurringBills={vi.fn()} /></BrowserRouter>)

        const pot_list = await screen.findAllByTestId('pot-item')
        const total_saved = await screen.findByTestId('pots-total')
        const pot_totals = await screen.findAllByTestId('pot-total')

        expect(pot_list).toHaveLength(4)
        expect(total_saved.textContent).toMatch('395')
        expect(pot_totals[0].textContent).toMatch('50')
        expect(pot_totals[1].textContent).toMatch('150')
        expect(pot_totals[2].textContent).toMatch('40')
        expect(pot_totals[3].textContent).toMatch('120')
    });

    // budgets
    it('test budget section values and rendering', async () => {
        render(<BrowserRouter><Overview user={mockUser} updateBudgets={vi.fn()} isAuthenticated={true} updateAuthStatus={vi.fn()} updatePots={vi.fn()} updateBudgetSpending={vi.fn()} updateRecurringBills={vi.fn()} /></BrowserRouter>)

        // budgets-spent , budgets-limit, budget-maximum
        const total_spent = await screen.findByTestId('budgets-spent')
        const budgets_limit = await screen.findByTestId('budgets-limit')
        const budgets_maximum = await screen.findAllByTestId('budget-maximum')

        expect(total_spent.textContent).toMatch('500')
        expect(budgets_limit.textContent).toMatch('of750 limit')
        expect(budgets_maximum.length).toEqual(2)
        expect(budgets_maximum[0].textContent).toMatch('500.00')
        expect(budgets_maximum[1].textContent).toMatch('250.00')

    });

    // transactions
    it('test recent transactions values, dates and rendering', async () => {
        render(<BrowserRouter><Overview user={mockUser} updateBudgets={vi.fn()} isAuthenticated={true} updateAuthStatus={vi.fn()} updatePots={vi.fn()} updateBudgetSpending={vi.fn()} updateRecurringBills={vi.fn()} /></BrowserRouter>)
        
        // list, amount, date
        const transactions = await screen.findAllByTestId('transaction')
        const t_amounts = await screen.findAllByTestId('t-amount')
        const t_dates = await screen.findAllByTestId('t-dates')
        
        expect(transactions.length).toEqual(3)
        expect(t_amounts[0].textContent).toMatch('+$18.50')
        expect(t_amounts[1].textContent).toMatch('-$17.00')
        expect(t_dates[2].textContent).toMatch('30 Jul 2024')
        

    });

    // recurring bills
    it('test recurring bills values', async () => {
        render(<BrowserRouter><Overview user={mockUser} updateBudgets={vi.fn()} isAuthenticated={true} updateAuthStatus={vi.fn()} updatePots={vi.fn()} updateBudgetSpending={vi.fn()} updateRecurringBills={vi.fn()} /></BrowserRouter>)
        
        const recurring_items = await screen.findAllByTestId('recurring-item')
        const paid_bills = await screen.findByTestId('paid')

        expect(recurring_items.length).toEqual(3)
        expect(paid_bills.textContent).toMatch('$17.00')

    });
});