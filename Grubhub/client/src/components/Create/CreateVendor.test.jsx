import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import CreateVendor from './CreateVendor';
import { userActions } from '../../js/actions';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mock the actions
vi.mock('../../js/actions', () => ({
  userActions: {
    registerUser: vi.fn(() => () => {}) // returns a thunk that does nothing
  }
}));

describe('CreateVendor Component', () => {
  it('renders all fields and sign in link', () => {
    const store = configureStore({ reducer: (state = {}) => state });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CreateVendor />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create your account/i })).toBeInTheDocument();
  });

  it('calls registerUser with correct data on submit', () => {
    const store = configureStore({ reducer: (state = {}) => state });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CreateVendor />
        </BrowserRouter>
      </Provider>
    );

    // Note: This might fail initially if labels are not correctly associated with inputs
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Vendor' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'vendor@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Create your account/i }));

    expect(userActions.registerUser).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: 'Vendor',
        last_name: 'User',
        email: 'vendor@example.com',
        password: 'password123',
        account_type: 'Vendor'
      }),
      expect.anything()
    );
  });
});
