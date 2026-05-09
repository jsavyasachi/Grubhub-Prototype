import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import CreateUser from './CreateUser';
import { userActions } from '../../js/actions';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mock the actions
vi.mock('../../js/actions', () => ({
  userActions: {
    registerUser: vi.fn(() => () => {}) // returns a thunk that does nothing
  }
}));

describe('CreateUser Component', () => {
  it('renders all fields and sign in link', () => {
    const store = configureStore({ reducer: (state = {}) => state });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CreateUser />
        </BrowserRouter>
      </Provider>
    );

    // Note: getByLabelText might fail if htmlFor and id don't match
    // Using getByText for the labels as a fallback if they are not associated correctly
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
          <CreateUser />
        </BrowserRouter>
      </Provider>
    );

    // Use getByLabelText now that labels are correctly associated
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Create your account/i }));

    expect(userActions.registerUser).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        account_type: 'User'
      }),
      expect.anything()
    );
  });
});
