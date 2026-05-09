import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { legacy_createStore as createStore } from 'redux';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginUser from './LoginUser';
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

describe('LoginUser Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password fields and sign in button', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginUser />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Sign in with your Grubhub user account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('updates input fields on change', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginUser />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls loginUser action on form submission', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginUser />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    expect(userActions.loginUser).toHaveBeenCalled();
  });
});
