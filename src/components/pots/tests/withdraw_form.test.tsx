import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { pot, userObj } from '../../../types'
import WithdrawForm from '../withdraw_form'
import userEvent from '@testing-library/user-event'


// mocks
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }
const mockPot: pot = { 'id': 100, 'name': 'Vacation', 'total': 50.00, 'target': 150.00, 'theme': '#626070' }
const mockPots: pot[] = [{ 'id': 100, 'name': 'Vacation', 'total': 50.00, 'target': 150.00, 'theme': '#FFF' }, { 'id': 101, 'name': 'Savings', 'total': 150.00, 'target': 550.00, 'theme': '#AAA' },
{ 'id': 111, 'name': 'Gift', 'total': 40.50, 'target': 80.00, 'theme': '#EEE' }, { 'id': 125, 'name': 'New Laptop', 'total': 120.00, 'target': 400.00, 'theme': '#3A3' },
{ 'id': 241, 'name': 'Concert Ticket', 'total': 35.00, 'target': 45.00, 'theme': '#D4A' }]
const mockHideForm = vi.fn()
const fetchMock = vi.fn();
fetchMock.mockReturnValue(
    Promise.resolve({
        status: 201,
        json: () => Promise.resolve([{}]),
    }),
);
vi.stubGlobal('fetch', fetchMock);

describe('test add form component', () => {
    it('test initial rendering and values', () => {
        render(<WithdrawForm user={mockUser} pot={mockPot} pots={mockPots} updatePots={vi.fn()} hideWithdrawForm={mockHideForm} />)

        expect(screen.getByRole('heading').textContent).toMatch("Withdraw from 'Vacation'")
        expect(screen.getByTestId('new-amount').textContent).toMatch('$50.00')
        expect(screen.getByTestId('percentage').textContent).toMatch('33.33%')
        expect(screen.getByTestId('target').textContent).toMatch('Target of $150')

    });

    it('test close form button', async () => {
        render(<WithdrawForm user={mockUser} pot={mockPot} pots={mockPots} updatePots={vi.fn()} hideWithdrawForm={mockHideForm} />)
        const user = userEvent.setup()
        const buttons = screen.getAllByRole('button')

        await user.click(buttons[0])

        expect(mockHideForm).toHaveBeenCalled()
    });

    it('test user input values', async () => {
        render(<WithdrawForm user={mockUser} pot={mockPot} pots={mockPots} updatePots={vi.fn()} hideWithdrawForm={mockHideForm} />)
        const user = userEvent.setup()

        const amount_input = screen.getByRole('spinbutton')
        await user.clear(amount_input)

        await user.type(amount_input, '20')

        expect(amount_input).toHaveValue(20)
        expect(screen.getByTestId('new-amount').textContent).toMatch('$30.00')
        expect(screen.getByTestId('percentage').textContent).toMatch('20%')

    });

    // test limit*
});