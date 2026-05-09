import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from './SearchResults';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../Navbar/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

const mockStore = (initialState) => {
  return createStore((state = initialState) => state);
};

describe('SearchResults Component', () => {
  it('renders "no results" message when search_results is empty', () => {
    const store = mockStore({ buyer: { search_results: [] } });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SearchResults />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Could find any restaurant serving this/i)).toBeInTheDocument();
  });

  it('renders results table when search_results is provided', () => {
    const search_results = [
      { id: 1, name: "Restaurant 1", address: "Address 1", cuisine: "Italian" },
      { id: 2, name: "Restaurant 2", address: "Address 2", cuisine: "Mexican" }
    ];
    const store = mockStore({ buyer: { search_results } });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SearchResults />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
    expect(screen.getByText('Address 1')).toBeInTheDocument();
    expect(screen.getAllByText('Italian').length).toBeGreaterThan(0);
    expect(screen.getByText('Restaurant 2')).toBeInTheDocument();
    
    const link = screen.getByRole('link', { name: 'Restaurant 1' });
    expect(link).toHaveAttribute('href', '/restaurant/detail/1');
  });
});
