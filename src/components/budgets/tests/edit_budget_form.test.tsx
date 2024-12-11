import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { budget, userObj } from '../../../types'
import EditBudgetForm from '../edit_budget_form'
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

describe('test edit budget form component', () => {
    it('test initial rendering and values', () => {
        render(<EditBudgetForm user={mockUser} budget={mockBudget} budgets={mockBudgets} updateBudgets={vi.fn()} hideEditForm={mockHideForm} />)

        // initial values
        const select_elements = screen.getAllByRole('combobox')
        const max_input = screen.getByRole('spinbutton', { name: /maximum/i })

        expect(screen.getByTestId('edit-form')).toBeInTheDocument()
        expect(select_elements[0]).toHaveValue('Bills')
        expect(select_elements[1]).toHaveValue('#F2CDAC')
        expect(max_input).toHaveValue(500)
    });

    // hideform button
    it('test close form button', async () => {
        render(<EditBudgetForm user={mockUser} budget={mockBudget} budgets={mockBudgets} updateBudgets={vi.fn()} hideEditForm={mockHideForm} />)
        const user = userEvent.setup()

        const buttons = screen.getAllByRole('button')
        
        await user.click(buttons[0])

        expect(mockHideForm).toHaveBeenCalled()
    });

    // user input
    it('test user input', async () => {
        render(<EditBudgetForm user={mockUser} budget={mockBudget} budgets={mockBudgets} updateBudgets={vi.fn()} hideEditForm={mockHideForm} />)
        const user = userEvent.setup()

        const select_elements = screen.getAllByRole('combobox')
        const max_input = screen.getByRole('spinbutton', { name: /maximum/i })

        // category select
        await user.selectOptions(select_elements[0], 'Entertainment')
        expect(select_elements[0]).toHaveValue('Entertainment')

        // max input
        await user.clear(max_input)
        await user.type(max_input, '400')
        expect(max_input).toHaveValue(400)

        // theme select
        await user.selectOptions(select_elements[1], 'Cyan')
        expect(select_elements[1]).toHaveValue('#82C9D7')
    });

});