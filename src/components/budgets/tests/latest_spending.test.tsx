import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import LatestSpending from '../latest_spending'
import { userObj } from '../../../types'
import { act } from 'react'


// mocks
const fetchMock = vi.fn();
fetchMock.mockReturnValue(
    Promise.resolve({
        json: () => Promise.resolve([{ 'amount': 1850, 'avatar': '', 'category': 'Education', 'date': '2024-08-01T09:25:11Z', 'id': 10, 'name': 'Daniel', 'recurring': false },
        { 'amount': 1700, 'avatar': '', 'category': 'Education', 'date': '2024-08-02T09:25:11Z', 'id': 12, 'name': 'Tom', 'recurring': false },
        { 'amount': 3000, 'avatar': '', 'category': 'Education', 'date': '2024-07-30T10:05:42Z', 'id': 11, 'name': 'Peter', 'recurring': false },]),
    }),
);
vi.stubGlobal('fetch', fetchMock);
const mockUser: userObj = { 'user': { 'id': 1, 'username': 'mo' }, 'token': '1234' }


describe('test latest spending component', () => {
    it('test component rendering', async () => {
        act(() => {
            render(<BrowserRouter><LatestSpending user={mockUser} category={'Education'} updateAuthStatus={vi.fn()} /></BrowserRouter>)
        })
        
        const transaction_list = await screen.findAllByRole('listitem');

        expect(transaction_list).toHaveLength(3)
        
        // amount
        const amount_list = await screen.findAllByTestId('amount')

        expect(amount_list).toHaveLength(3)
        expect(amount_list[1]).toHaveTextContent('-$17.00')
        expect(amount_list[2]).toHaveTextContent('-$30.00')

        // date
        const date_list = await screen.findAllByTestId('date')

        expect(date_list).toHaveLength(3)
        expect(date_list[0]).toHaveTextContent('1 Aug 2024')
        expect(date_list[2]).toHaveTextContent('30 Jul 2024')
    });
});


