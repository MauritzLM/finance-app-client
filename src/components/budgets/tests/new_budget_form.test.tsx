import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { budget, userObj } from '../../../types'
import NewBudgetForm from '../new_budget_form'
import userEvent from '@testing-library/user-event'

// mocks
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }
const mockBudgets: budget[] = [{ 'id': 1, 'category': 'Bills', 'maximum': 50000, 'theme': '#fff' }, { 'id': 2, 'category': 'Education', 'maximum': 25000, 'theme': '#1f3' }]
const mockHideForm = vi.fn()
const fetchMock = vi.fn();
fetchMock.mockReturnValue(
    Promise.resolve({
        status: 201,
        json: () => Promise.resolve([{}]),
    }),
);
vi.stubGlobal('fetch', fetchMock);


describe('new budget form component tests', () => {
    it('test initial rendering', () => {
        render(<NewBudgetForm user={mockUser} budgets={mockBudgets} updateBudgets={vi.fn()} updateNewBudget={vi.fn()} hideNewForm={vi.fn()} />)

        const select_elements = screen.getAllByRole('combobox')
        expect(screen.getByTestId('new-form')).toBeInTheDocument()
        expect(select_elements.length).toEqual(2)

        expect(screen.getByRole('spinbutton', { name: /maximum/i })).toBeInTheDocument()

    });

    it('test close form button', async () => {
        render(<NewBudgetForm user={mockUser} budgets={mockBudgets} updateBudgets={vi.fn()} updateNewBudget={vi.fn()} hideNewForm={mockHideForm} />)
        const user = userEvent.setup()
        const buttons = screen.getAllByRole('button')

        await user.click(buttons[0])

        expect(mockHideForm).toHaveBeenCalled()

    });

    it('test user input and values', async () => {
        render(<NewBudgetForm user={mockUser} budgets={mockBudgets} updateBudgets={vi.fn()} updateNewBudget={vi.fn()} hideNewForm={mockHideForm} />)
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

    // errors / submission*
});