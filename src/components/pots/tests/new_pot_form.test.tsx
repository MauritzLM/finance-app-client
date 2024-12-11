import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { pot, userObj } from '../../../types'
import NewPotForm from '../new_pot_form'
import userEvent from '@testing-library/user-event'


// mocks
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }
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

describe('test new pot form component', () => {
    it('test initial rendering', () => {
        render(<NewPotForm user={mockUser} pots={mockPots} updatePots={vi.fn()} hideNewForm={mockHideForm} />)

        expect(screen.getByRole('textbox', { 'name': /pot name/i })).toBeInTheDocument()
        expect(screen.getByRole('spinbutton')).toBeInTheDocument()
        expect(screen.getByRole('combobox')).toBeInTheDocument()
    });

    it('test close form button', async () => {
        render(<NewPotForm user={mockUser} pots={mockPots} updatePots={vi.fn()} hideNewForm={mockHideForm} />)
        const user = userEvent.setup()
        const buttons = screen.getAllByRole('button')

        await user.click(buttons[0])

        expect(mockHideForm).toHaveBeenCalled()
    });

    it('test user input and values', async () => {
        render(<NewPotForm user={mockUser} pots={mockPots} updatePots={vi.fn()} hideNewForm={mockHideForm} />)
        const user = userEvent.setup()

        const name_input = screen.getByRole('textbox', { 'name': /pot name/i })
        const target_input = screen.getByRole('spinbutton')
        const theme_select = screen.getByRole('combobox')

        await user.type(name_input, 'Savings')
        await user.clear(target_input)
        await user.type(target_input, '1000')
        await user.selectOptions(theme_select, 'Navy')

        expect(name_input).toHaveValue('Savings')
        expect(target_input).toHaveValue(1000)
        expect(theme_select).toHaveValue('#626070')
    });

});