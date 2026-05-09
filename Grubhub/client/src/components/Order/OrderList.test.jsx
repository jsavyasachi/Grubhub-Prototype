import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OrderList from './OrderList';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { vendorActions } from '../../js/actions/index';

vi.mock('../../js/actions/index', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    vendorActions: {
      ...actual.vendorActions,
      getRestaurantOrders: vi.fn(() => ({ type: 'MOCK_ACTION' })),
      getBuyerOrders: vi.fn(() => ({ type: 'MOCK_ACTION' })),
      getRestaurant: vi.fn(() => ({ type: 'MOCK_ACTION' })),
      changeStatus: vi.fn(() => ({ type: 'MOCK_ACTION' })),
    },
    userActions: {
        ...actual.userActions,
        getUser: vi.fn(() => ({ type: 'MOCK_ACTION' })),
    }
  };
});

// Mock components that might cause issues in JSDOM or are not relevant to this test
vi.mock('../Sidebar/Sidebar', () => ({
    default: () => <div data-testid="sidebar">Sidebar</div>
}));
vi.mock('../Navbar/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>
}));
vi.mock('react-bootstrap-table-next', () => ({
    default: ({ data, columns }) => (
        <table>
            <thead>
                <tr>{columns.map(c => <th key={c.dataField}>{c.text}</th>)}</tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        {columns.map(c => (
                            <td key={c.dataField}>
                                {c.formatter ? c.formatter(row[c.dataField], row) : row[c.dataField]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}));
vi.mock('react-bootstrap-table2-editor', () => ({
    default: vi.fn(),
    Type: { SELECT: 'SELECT' }
}));

const mockStore = (initialState) => {
  return createStore((state = initialState) => state, applyMiddleware(thunk));
};

describe('OrderList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Current and Previous Orders tables for Vendor', () => {
    const initialState = {
      user: { account_type: 'Vendor', id: '1' },
      restaurant: { id: 'r1' },
      order: {
        current_orders: [{ id: '1', amount: 20, status: 'NEW' }],
        past_orders: [{ id: '2', amount: 15, status: 'DELIVERED' }]
      }
    };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/order/1']}>
          <Routes>
            <Route path="/order/:id" element={<OrderList />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Current Orders')).toBeInTheDocument();
    expect(screen.getByText('Previous Orders')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    
    // Check if ID is rendered as a link (formatter test)
    const orderLink = screen.getByText('1');
    expect(orderLink.closest('a')).toHaveAttribute('href', '/order/detail/1');

    expect(vendorActions.getRestaurantOrders).toHaveBeenCalled();
  });

  it('renders Current and Previous Orders tables for User', () => {
    const initialState = {
      user: { account_type: 'User', id: '1' },
      restaurant: {},
      order: {
        current_orders: [{ id: '3', amount: 30, status: 'NEW' }],
        past_orders: [{ id: '4', amount: 25, status: 'DELIVERED' }]
      }
    };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/order/1']}>
          <Routes>
            <Route path="/order/:id" element={<OrderList />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Current Orders')).toBeInTheDocument();
    expect(screen.getByText('Previous Orders')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    
    expect(vendorActions.getBuyerOrders).toHaveBeenCalled();
  });
});
