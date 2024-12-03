import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Budgets from '../budgets'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { budget, budget_spending, userObj } from '../../types'

// mocks
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }
const mockBudgets: budget[] = [{ 'id': 1, 'category': 'Bills', 'maximum': 500.00, 'theme': '#fff' }, { 'id': 2, 'category': 'Education', 'maximum': 250.00, 'theme': '#1f3' }]
const mock_budget_spending: budget_spending = { 'Bills': 400.00, 'Education': 100.00 }

const fetchMock = vi.fn();
fetchMock.mockReturnValue(
    Promise.resolve({
        json: () => Promise.resolve([{}]),
    }),
);
vi.stubGlobal('fetch', fetchMock);

// test rendering
describe('test component rendering', () => {
    it('test budget summary', () => {
        render(<BrowserRouter><Budgets user={mockUser} budgets={mockBudgets} budgetSpending={mock_budget_spending} updateBudgetSpending={vi.fn()} updateBudgets={vi.fn()} /></BrowserRouter>)

        // correct total and limit
        expect(screen.getByTestId('total-spent')).toHaveTextContent('$500')
        expect(screen.getByTestId('limit')).toHaveTextContent('of $750 limit')

        // spending of maximum
        expect(screen.getAllByTestId('summary-list')).toHaveLength(2)

        const summary_spending = screen.getAllByTestId('budget-spending')
        expect(summary_spending).toHaveLength(2)
        expect(summary_spending[0]).toHaveTextContent('$400.00 of $500.00')
        expect(summary_spending[1]).toHaveTextContent('$100.00 of $250.00')
    });


    it('test budget detail', () => {
        render(<BrowserRouter><Budgets user={mockUser} budgets={mockBudgets} budgetSpending={mock_budget_spending} updateBudgetSpending={vi.fn()} updateBudgets={vi.fn()} /></BrowserRouter>)

        // category heading
        const detail_categories = screen.getAllByTestId('detail-category')

        expect(detail_categories).toHaveLength(2)
        expect(detail_categories[0]).toHaveTextContent('Bills')
        expect(detail_categories[1]).toHaveTextContent('Education')

        // total spent
        const detail_spending = screen.getAllByTestId('detail-spending')

        expect(detail_spending).toHaveLength(2)
        expect(detail_spending[0]).toHaveTextContent('$400.00')
        expect(detail_spending[1]).toHaveTextContent('$100.00')

        // remaining
        const detail_remaining = screen.getAllByTestId('detail-remaining')

        expect(detail_remaining).toHaveLength(2)
        expect(detail_remaining[0]).toHaveTextContent('$100.00')
        expect(detail_remaining[1]).toHaveTextContent('$150.00')
    })

});