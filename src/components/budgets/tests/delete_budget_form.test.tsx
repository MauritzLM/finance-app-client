import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { budget, userObj } from '../../../types'
import DeleteBudgetForm from '../delete_budget_form'
import userEvent from '@testing-library/user-event'

// mocks
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }
const mockBudget: budget = { 'id': 1, 'category': 'Bills', 'maximum': 50000, 'theme': '#F2CDAC' }
const mockBudgets: budget[] = [{ 'id': 1, 'category': 'Bills', 'maximum': 50000, 'theme': '#F2CDAC' }, { 'id': 2, 'category': 'Education', 'maximum': 25000, 'theme': '#93674F' }]
const mockHideForm = vi.fn()
const fetchMock = vi.fn();
fetchMock.mockReturnValue(
    Promise.resolve({
        status: 201,
        json: () => Promise.resolve([{}]),
    }),
);
vi.stubGlobal('fetch', fetchMock);

describe('test delete budget form component', () => {
    it('test initial rendering', () => {
       render(<DeleteBudgetForm user={mockUser} budget={mockBudget} budgets={mockBudgets} updateBudgets={vi.fn()} hideDeleteForm={mockHideForm}/>)
       
       expect(screen.getByRole('heading').textContent).toMatch("Delete 'Bills'?")

    });

    it('test close form button', async () => {
       render(<DeleteBudgetForm user={mockUser} budget={mockBudget} budgets={mockBudgets} updateBudgets={vi.fn()} hideDeleteForm={mockHideForm}/>)
       const user = userEvent.setup()

       const close_btn = screen.getByText(/no, go back/i)
       await user.click(close_btn)

       expect(mockHideForm).toHaveBeenCalled()

    });
});