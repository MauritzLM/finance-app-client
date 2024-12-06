import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { pot, userObj } from '../../../types'
import EditPotForm from '../edit_pot_form'
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

describe('test new pot form component', () => {
    it('test initial rendering', () => {
        render(<EditPotForm user={mockUser} pot={mockPot} pots={mockPots} updatePots={vi.fn()} hideEditForm={mockHideForm} />)

        expect(screen.getByRole('textbox', { 'name': /pot name/i })).toHaveValue('Vacation')
        expect(screen.getByRole('spinbutton')).toHaveValue(150)
        expect(screen.getByRole('combobox')).toHaveValue('#626070')
    });

    it('test close form button', async () => {
        render(<EditPotForm user={mockUser} pot={mockPot} pots={mockPots} updatePots={vi.fn()} hideEditForm={mockHideForm} />)
        const user = userEvent.setup()
        const buttons = screen.getAllByRole('button')

        await user.click(buttons[0])

        expect(mockHideForm).toHaveBeenCalled()
    });

    it('test user input and values', async () => {
        render(<EditPotForm user={mockUser} pot={mockPot} pots={mockPots} updatePots={vi.fn()} hideEditForm={mockHideForm} />)
        const user = userEvent.setup()

        const name_input = screen.getByRole('textbox', { 'name': /pot name/i })
        const target_input = screen.getByRole('spinbutton')
        const theme_select = screen.getByRole('combobox')
        
        await user.clear(name_input)
        await user.type(name_input, 'Savings')
        await user.clear(target_input)
        await user.type(target_input, '200')
        await user.selectOptions(theme_select, 'Red')

        expect(name_input).toHaveValue('Savings')
        expect(target_input).toHaveValue(200)
        expect(theme_select).toHaveValue('#C94736')
    });

});