import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

const mockStore = (initialState) => {
  return createStore((state = initialState) => state, applyMiddleware(thunk));
};

describe('Profile Component', () => {
  const initialUserState = {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    account_type: 'Customer',
    image: 'profile.jpg'
  };

  const initialRestaurantState = {
    id: '101',
    name: 'Pizza Palace',
    cuisine: 'Italian',
    address: '456 Pizza Ave',
    zipcode: '12345',
    image: 'restaurant.jpg'
  };

  it('renders customer profile fields correctly', () => {
    const store = mockStore({
      user: initialUserState,
      restaurant: {}
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/Phone/i)).toHaveValue('1234567890');
    expect(screen.getByLabelText(/^Address$/i)).toHaveValue('123 Main St');
    
    // Vendor fields should NOT be rendered
    expect(screen.queryByLabelText(/Restaurant Name/i)).not.toBeInTheDocument();
  });

  it('renders vendor profile and restaurant fields correctly', () => {
    const store = mockStore({
      user: { ...initialUserState, account_type: 'Vendor' },
      restaurant: initialRestaurantState
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/Restaurant Name/i)).toHaveValue('Pizza Palace');
    expect(screen.getByLabelText(/Cuisine/i)).toHaveValue('Italian');
    expect(screen.getByLabelText(/Restaurant Address/i)).toHaveValue('456 Pizza Ave');
    expect(screen.getByLabelText(/Restaurant Zipcode/i)).toHaveValue('12345');
  });

  it('updates input values on change', () => {
    const store = mockStore({
      user: initialUserState,
      restaurant: {}
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </Provider>
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'Jane', id: 'first_name' } });
    expect(firstNameInput).toHaveValue('Jane');

    const addressInput = screen.getByLabelText(/^Address$/i);
    fireEvent.change(addressInput, { target: { value: '789 New St', id: 'address' } });
    expect(addressInput).toHaveValue('789 New St');
  });
});
