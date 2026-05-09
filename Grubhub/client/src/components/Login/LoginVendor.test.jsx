import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { legacy_createStore as createStore } from 'redux';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginVendor from './LoginVendor';
import { userActions } from '../../js/actions/index';

// Mock the actions
vi.mock('../../js/actions/index', () => ({
  userActions: {
    loginUser: vi.fn(() => ({ type: 'MOCK_LOGIN' }))
  }
}));

const initialState = {
  user: {}
};

const reducer = (state = initialState, action) => state;
const store = createStore(reducer);

describe('LoginVendor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password fields, sign in button and create account link', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginVendor />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Sign in with your Grubhub vendor account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/Create Vendor Account/i)).toBeInTheDocument();
  });

  it('calls loginUser action on form submission with correct data', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginVendor />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { id: 'email', value: 'vendor@example.com' } });
    fireEvent.change(passwordInput, { target: { id: 'password', value: 'password123' } });
    fireEvent.click(signInButton);

    expect(userActions.loginUser).toHaveBeenCalledWith(
      { email: 'vendor@example.com', password: 'password123' },
      expect.anything()
    );
  });
});
