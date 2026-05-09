import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OrderDetails from './OrderDetails';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { vendorActions } from '../../js/actions/index';

vi.mock('../../js/actions/index', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    vendorActions: {
      ...actual.vendorActions,
      getOrderDetails: vi.fn(() => ({ type: 'MOCK_ACTION' })),
    }
  };
});

vi.mock('../Sidebar/Sidebar', () => ({
    default: () => <div data-testid="sidebar">Sidebar</div>
}));
vi.mock('../Navbar/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>
}));
vi.mock('react-bootstrap-table-next', () => ({
    default: ({ data, columns }) => (
        <table data-testid="dishes-table">
            <thead>
                <tr>{columns.map(c => <th key={c.dataField}>{c.text}</th>)}</tr>
            </thead>
            <tbody>
                {data && data.map((row, i) => (
                    <tr key={i}>
                        {columns.map(c => (
                            <td key={c.dataField}>
                                {row[c.dataField]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}));

const mockStore = (initialState) => {
  return createStore((state = initialState) => state, applyMiddleware(thunk));
};

describe('OrderDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const activeOrder = {
    id: 'ORD123',
    status: 'DELIVERED',
    amount: '50.00',
    dishes: [
      { name: 'Pizza', quantity: 2 },
      { name: 'Coke', quantity: 1 }
    ],
    buyer: {
      name: 'John Doe',
      address: '123 Main St, San Jose, CA'
    }
  };

  it('renders order details correctly', () => {
    const initialState = {
      user: { account_type: 'Vendor' },
      order: {
        active: activeOrder
      }
    };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/order/detail/ORD123']}>
          <Routes>
            <Route path="/order/detail/:order_id" element={<OrderDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText('Order ID')).toHaveValue('ORD123');
    expect(screen.getByLabelText('Buyer Name')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Buyer Address')).toHaveValue('123 Main St, San Jose, CA');
    expect(screen.getByLabelText('Amount')).toHaveValue('50.00');
    expect(screen.getByLabelText('Status')).toHaveValue('DELIVERED');

    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Coke')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls getOrderDetails on mount', () => {
    const initialState = {
      user: { account_type: 'User' },
      order: {
        active: activeOrder
      }
    };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/order/detail/ORD123']}>
          <Routes>
            <Route path="/order/detail/:order_id" element={<OrderDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(vendorActions.getOrderDetails).toHaveBeenCalledWith({ order_id: 'ORD123' });
  });

  it('handles null order details gracefully', () => {
    const initialState = {
      user: { account_type: 'User' },
      order: {
        active: null
      }
    };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/order/detail/ORD123']}>
          <Routes>
            <Route path="/order/detail/:order_id" element={<OrderDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText('Order ID')).toHaveValue('');
    expect(screen.getByLabelText('Buyer Name')).toHaveValue('');
  });
});
