import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import Search from './Search';
import { buyerActions } from '../../js/actions/index';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../../js/actions/index', () => ({
  buyerActions: {
    getResults: vi.fn(() => ({ type: 'MOCK_ACTION' }))
  },
  userActions: {},
  vendorActions: {},
  dishActions: {}
}));

// Mock Navbar to avoid issues with its internal dependencies/routes
vi.mock('../Navbar/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

const mockStore = (initialState) => {
  return createStore((state = initialState) => state, applyMiddleware(thunk));
};

describe('Search Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and button', () => {
    const store = mockStore({});
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Search />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Search for Dishes Here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('calls getResults on form submit', () => {
    const store = mockStore({});
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Search />
        </MemoryRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText(/Search for Dishes Here/i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: 'pizza', id: 'search' } });
    fireEvent.click(button);

    expect(buyerActions.getResults).toHaveBeenCalled();
    const callArgs = buyerActions.getResults.mock.calls[0][0];
    expect(callArgs).toEqual({ search: 'pizza' });
  });
});
