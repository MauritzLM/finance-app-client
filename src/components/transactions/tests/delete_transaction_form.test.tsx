import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { userObj } from '../../../types'
import userEvent from '@testing-library/user-event'
import DeleteTransactionForm from '../delete_transaction_form'

const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }
const mockHideForm = vi.fn()
const mockTransaction = { 'amount': 1850, 'avatar': 'test.jpg', 'category': 'Education', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': false }

describe('test delete transaction form component', () => {
    it('test initial rendering', () => {
        render(<DeleteTransactionForm user={mockUser} hideDeleteForm={mockHideForm} selected_transaction={mockTransaction} />)

        const message = screen.getByTestId('message')

        expect(screen.getByTestId('delete-form')).toBeInTheDocument()
        expect(message.textContent).toMatch('Are you sure you want to delete Daniel - 1 Aug 2024? This cannot be reversed!')
    });

    it('test close button', async () => {
        render(<DeleteTransactionForm user={mockUser} hideDeleteForm={mockHideForm} selected_transaction={mockTransaction} />)
        const close_btn = screen.getByTestId('close-btn')

        await userEvent.click(close_btn)

        expect(mockHideForm).toHaveBeenCalled()
    });
});