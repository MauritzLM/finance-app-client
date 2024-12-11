import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { pot, userObj } from '../../../types'
import DeletePotForm from '../delete_pot_form'
import userEvent from '@testing-library/user-event'


// mocks
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }
const mockPot: pot = { 'id': 100, 'name': 'Vacation', 'total': 5000, 'target': 15000, 'theme': '#626070' }
const mockPots: pot[] = [{ 'id': 100, 'name': 'Vacation', 'total': 5000, 'target': 15000, 'theme': '#FFF' }, { 'id': 101, 'name': 'Savings', 'total': 15000, 'target': 55000, 'theme': '#AAA' },
{ 'id': 111, 'name': 'Gift', 'total': 4050, 'target': 8000, 'theme': '#EEE' }, { 'id': 125, 'name': 'New Laptop', 'total': 12000, 'target': 40000, 'theme': '#3A3' },
{ 'id': 241, 'name': 'Concert Ticket', 'total': 3500, 'target': 4500, 'theme': '#D4A' }]
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
        render(<DeletePotForm user={mockUser} pot={mockPot} pots={mockPots} updatePots={vi.fn()} hideDeleteForm={mockHideForm} />)

        expect(screen.getByRole('heading').textContent).toMatch("Delete 'Vacation'?")

    });

    it('test close form button', async () => {
        render(<DeletePotForm user={mockUser} pot={mockPot} pots={mockPots} updatePots={vi.fn()} hideDeleteForm={mockHideForm} />)
        const user = userEvent.setup()

        const close_btn = screen.getByText(/no, go back/i)
        await user.click(close_btn)

        expect(mockHideForm).toHaveBeenCalled()

    });
});