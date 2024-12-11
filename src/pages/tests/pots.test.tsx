import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Pots from '../pots'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';
import { pot, userObj } from '../../types'

// mocks
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }
const mockPots: pot[] = [{ 'id': 100, 'name': 'Vacation', 'total': 5000, 'target': 15000, 'theme': '#FFF' }, { 'id': 101, 'name': 'Savings', 'total': 15000, 'target': 55000, 'theme': '#AAA' },
{ 'id': 111, 'name': 'Gift', 'total': 4050, 'target': 8000, 'theme': '#EEE' }, { 'id': 125, 'name': 'New Laptop', 'total': 12000, 'target': 40000, 'theme': '#3A3' },
{ 'id': 241, 'name': 'Concert Ticket', 'total': 3500, 'target': 4500, 'theme': '#D4A' }]


const fetchMock = vi.fn();
fetchMock.mockReturnValue(
    Promise.resolve({
        json: () => Promise.resolve([{}]),
    }),
);
vi.stubGlobal('fetch', fetchMock);


describe('pot component tests', () => {
    it('test pot items', () => {
        render(<BrowserRouter><Pots user={mockUser} pots={mockPots} updatePots={vi.fn()} /></BrowserRouter>)

        expect(screen.getAllByTestId('pot-item').length).toEqual(5)
    });

    it('test pot total values', () => {
        render(<BrowserRouter><Pots user={mockUser} pots={mockPots} updatePots={vi.fn()} /></BrowserRouter>)

        const pot_totals = screen.getAllByTestId('pot-total')

        expect(pot_totals[0].textContent).toMatch('$50.00')
        expect(pot_totals[3].textContent).toMatch('$120.00')
    });

    it('test pot percentage values', () => {
        render(<BrowserRouter><Pots user={mockUser} pots={mockPots} updatePots={vi.fn()} /></BrowserRouter>)

        const pot_percetages = screen.getAllByTestId('pot-percentage')

        expect(pot_percetages[0].textContent).toMatch('33.33%')
        expect(pot_percetages[2].textContent).toMatch('50.63%')
    });

    it('test pot target values', () => {
        render(<BrowserRouter><Pots user={mockUser} pots={mockPots} updatePots={vi.fn()} /></BrowserRouter>)

        const pot_targets = screen.getAllByTestId('pot-target')

        expect(pot_targets[1].textContent).toMatch('Target of $550')

    });

    // show form buttons -> add, withdraw, edit, new, delete
    it('test clicking new pot button displays new pot form', async () => {
        render(<BrowserRouter><Pots user={mockUser} pots={mockPots} updatePots={vi.fn()} /></BrowserRouter>)

        const user = userEvent.setup()
        const new_btn = screen.getByTestId('new-btn')

        await user.click(new_btn)

        const new_form = await screen.findByTestId('new-form')
        expect(new_form).toBeInTheDocument()
    });

    it('test clicking edit pot button displays edit pot form', async () => {
        render(<BrowserRouter><Pots user={mockUser} pots={mockPots} updatePots={vi.fn()} /></BrowserRouter>)

        const user = userEvent.setup()
        const edit_btn = screen.getAllByTestId('edit-btn')

        await user.click(edit_btn[0])

        const edit_form = await screen.findByTestId('edit-form')
        expect(edit_form).toBeInTheDocument()
    });

    it('test clicking delete pot button displays delete form', async () => {
        render(<BrowserRouter><Pots user={mockUser} pots={mockPots} updatePots={vi.fn()} /></BrowserRouter>)

        const user = userEvent.setup()
        const delete_btn = screen.getAllByTestId('delete-btn')

        await user.click(delete_btn[0])

        const delete_form = await screen.findByTestId('delete-form')
        expect(delete_form).toBeInTheDocument()
    });

    it('test clicking add money button displays add form', async () => {
        render(<BrowserRouter><Pots user={mockUser} pots={mockPots} updatePots={vi.fn()} /></BrowserRouter>)

        const user = userEvent.setup()
        const add_btn = screen.getAllByTestId('add-btn')

        await user.click(add_btn[0])

        const add_form = await screen.findByTestId('add-form')
        expect(add_form).toBeInTheDocument()
    });

    it('test clicking withdraw button displays withdraw form', async () => {
        render(<BrowserRouter><Pots user={mockUser} pots={mockPots} updatePots={vi.fn()} /></BrowserRouter>)

        const user = userEvent.setup()
        const withdraw_btn = screen.getAllByTestId('withdraw-btn')

        await user.click(withdraw_btn[0])

        const withdraw_form = await screen.findByTestId('withdraw-form')
        expect(withdraw_form).toBeInTheDocument()
    });
});
