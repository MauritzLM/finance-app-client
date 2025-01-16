import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Budgets from '../budgets'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { budget, budget_spending, userObj } from '../../types'
import userEvent from '@testing-library/user-event'

// mocks
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }
const mockBudgets: budget[] = [{ 'id': 1, 'category': 'Bills', 'maximum': 50000, 'theme': '#fff' }, { 'id': 2, 'category': 'Education', 'maximum': 25000, 'theme': '#1f3' }]
const mock_budget_spending: budget_spending = { 'Bills': 40000, 'Education': 10000 }

const fetchMock = vi.fn();
fetchMock.mockReturnValue(
    Promise.resolve({
        json: () => Promise.resolve([{}]),
    }),
);
vi.stubGlobal('fetch', fetchMock);

vi.mock('../../components/budgets/latest_spending')

// test rendering
describe('test budget component', () => {
    it('test budget summary', () => {
        render(<BrowserRouter><Budgets user={mockUser} budgets={mockBudgets} budgetSpending={mock_budget_spending} updateBudgetSpending={vi.fn()} updateBudgets={vi.fn()} /></BrowserRouter>)

        // correct total and limit
        expect(screen.getByTestId('total-spent').textContent).toMatch('500')
        expect(screen.getByTestId('limit').textContent).toMatch('of 750 limit')

        // spending of maximum
        expect(screen.getAllByTestId('summary-list')).toHaveLength(2)

        const summary_spending = screen.getAllByTestId('budget-spending')
        expect(summary_spending).toHaveLength(2)
        expect(summary_spending[0].textContent).toMatch('400.00of 500.00')
        expect(summary_spending[1].textContent).toMatch('100.00of 250.00')
    });


    it('test budget detail', () => {
        render(<BrowserRouter><Budgets user={mockUser} budgets={mockBudgets} budgetSpending={mock_budget_spending} updateBudgetSpending={vi.fn()} updateBudgets={vi.fn()} /></BrowserRouter>)

        // category heading
        const detail_categories = screen.getAllByTestId('detail-category')

        expect(detail_categories).toHaveLength(2)
        expect(detail_categories[0].textContent).toMatch('Bills')
        expect(detail_categories[1].textContent).toMatch('Education')

        // total spent
        const detail_spending = screen.getAllByTestId('detail-spending')

        expect(detail_spending).toHaveLength(2)
        expect(detail_spending[0].textContent).toMatch('400.00')
        expect(detail_spending[1].textContent).toMatch('100.00')

        // remaining
        const detail_remaining = screen.getAllByTestId('detail-remaining')

        expect(detail_remaining).toHaveLength(2)
        expect(detail_remaining[0].textContent).toMatch('100.00')
        expect(detail_remaining[1].textContent).toMatch('150.00')
    })

    // new, edit, delete
    it('clicking add new button displays new budget form', async () => {
        render(<BrowserRouter><Budgets user={mockUser} budgets={mockBudgets} budgetSpending={mock_budget_spending} updateBudgetSpending={vi.fn()} updateBudgets={vi.fn()} /></BrowserRouter>)

        const user = userEvent.setup()
        const new_btn = screen.getByTestId('new-btn')

        await user.click(new_btn)

        const new_form = await screen.findByTestId('new-form')

        expect(new_form).toBeInTheDocument()
    });

    it('clicking edit button displays edit budget form', async () => {
        render(<BrowserRouter><Budgets user={mockUser} budgets={mockBudgets} budgetSpending={mock_budget_spending} updateBudgetSpending={vi.fn()} updateBudgets={vi.fn()} /></BrowserRouter>)

        const user = userEvent.setup()
        const edit_btns = screen.getAllByTestId('edit-btn')

        await user.click(edit_btns[0])

        const edit_form = await screen.findByTestId('edit-form')

        expect(edit_form).toBeInTheDocument()
    });

    it('clicking delete button displays delete budget form', async () => {
        render(<BrowserRouter><Budgets user={mockUser} budgets={mockBudgets} budgetSpending={mock_budget_spending} updateBudgetSpending={vi.fn()} updateBudgets={vi.fn()} /></BrowserRouter>)

        const user = userEvent.setup()
        const delete_btns = screen.getAllByTestId('delete-btn')

        await user.click(delete_btns[0])

        const delete_form = await screen.findByTestId('delete-form')

        expect(delete_form).toBeInTheDocument()
    });

});