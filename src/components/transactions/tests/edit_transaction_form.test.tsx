import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { transaction, userObj } from '../../../types'
import userEvent from '@testing-library/user-event'
import EditTransactionForm from '../edit_transaction_form'

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
const mockToggleDelete = vi.fn()
const mockTransaction = { 'amount': 1850, 'avatar': 'test.jpg', 'category': 'Education', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': false }

describe('tests for edit transaction form', () => {
    it('initial rendering and input values', () => {
        render(<EditTransactionForm user={mockUser} selected_transaction={mockTransaction} recurringBills={mockBills} updateRecurringBills={vi.fn()} hideEditForm={mockHideForm} toggleDelete={mockToggleDelete} />)

        const inputs = screen.getAllByTestId('form-input')
        // 0.avatar (select), 1.name (text), 2.category (select), 3.date (date), 4.amount (number), 5.recurring (checkbox)

        expect(screen.getByTestId('edit-form')).toBeInTheDocument()
        expect(inputs).toHaveLength(6)
        expect(inputs[0]).toHaveValue('test.jpg')
        expect(inputs[1]).toHaveValue('Daniel')
        expect(inputs[2]).toHaveValue('Education')
        expect(inputs[3]).toHaveValue('2024-08-01')
        expect(inputs[4]).toHaveValue(1850)
        expect(inputs[5]).not.toBeChecked()
    });

    it('test close form button', async () => {
        render(<EditTransactionForm user={mockUser} selected_transaction={mockTransaction} recurringBills={mockBills} updateRecurringBills={vi.fn()} hideEditForm={mockHideForm} toggleDelete={mockToggleDelete} />)
        const user = userEvent.setup()
        const close_btn = screen.getByTestId('close-btn')

        await user.click(close_btn)

        expect(mockHideForm).toHaveBeenCalled()
    });

    it('test delete toggle button', async () => {
        render(<EditTransactionForm user={mockUser} selected_transaction={mockTransaction} recurringBills={mockBills} updateRecurringBills={vi.fn()} hideEditForm={mockHideForm} toggleDelete={mockToggleDelete} />)
        const user = userEvent.setup()
        const delete_toggle_btn = screen.getByTestId('delete-toggle-btn')

        await user.click(delete_toggle_btn)

        expect(mockToggleDelete).toHaveBeenCalled()
    });

    it('test user input and values', async () => {
        render(<EditTransactionForm user={mockUser} selected_transaction={mockTransaction} recurringBills={mockBills} updateRecurringBills={vi.fn()} hideEditForm={mockHideForm} toggleDelete={mockToggleDelete} />)
        const user = userEvent.setup()
        const inputs = screen.getAllByTestId('form-input')

        // 0.avatar (select), 1.name (text), 2.category (select), 3.date (date), 4.amount (number), 5.recurring (checkbox)
        await user.clear(inputs[1])
        await user.clear(inputs[4])

        await user.type(inputs[1], 'New user')
        await user.selectOptions(inputs[2], 'General')
        await user.type(inputs[4], '1400')
        await user.click(inputs[5])

        expect(inputs[1]).toHaveValue('New user')
        expect(inputs[2]).toHaveValue('General')
        expect(inputs[4]).toHaveValue(1400)
        expect(inputs[5]).toBeChecked()

    });

});