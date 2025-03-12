import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { transaction, userObj } from '../../../types'
import userEvent from '@testing-library/user-event'
import NewTransactionForm from '../new_transaction_form'

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
const mockHideForm = vi.fn()

describe('tests for new transaction form component', () => {
    it('test initial rendering', () => {
        render(<NewTransactionForm user={mockUser} recurringBills={mockBills} updateRecurringBills={vi.fn()} hideNewForm={vi.fn()} />)

        // form rendered with all inputs
        const form = screen.getByTestId('new-form')
        const inputs = screen.getAllByTestId('form-input')

        expect(form).toBeInTheDocument()
        expect(inputs).toHaveLength(6)
    });

    // close-btn
    it('test close form button', async () => {
        render(<NewTransactionForm user={mockUser} recurringBills={mockBills} updateRecurringBills={vi.fn()} hideNewForm={mockHideForm} />)
        const user = userEvent.setup()
        const buttons = screen.getAllByRole('button')

        await user.click(buttons[0])

        expect(mockHideForm).toHaveBeenCalled()
    });

    it('test user input and values', async () => {
        render(<NewTransactionForm user={mockUser} recurringBills={mockBills} updateRecurringBills={vi.fn()} hideNewForm={mockHideForm} />)

        const user = userEvent.setup()
        const inputs = screen.getAllByTestId('form-input')

        // 0.avatar (select), 1.name (text), 2.category (select), 3.date (date), 4.amount (number), 5.recurring (checkbox)
        await user.type(inputs[1], 'user')
        await user.selectOptions(inputs[2], 'Education')
        await user.type(inputs[4], '400')
        await user.click(inputs[5])

        expect(inputs[1]).toHaveValue('user')
        expect(inputs[2]).toHaveValue('Education')
        expect(inputs[4]).toHaveValue(400)
        expect(inputs[5]).toBeChecked()

    });
});