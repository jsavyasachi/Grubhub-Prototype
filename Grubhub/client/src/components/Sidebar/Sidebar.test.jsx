import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import cookie from 'js-cookie';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock js-cookie
vi.mock('js-cookie', () => ({
  default: {
    remove: vi.fn(),
  },
}));

const mockStore = (initialState) => {
  return createStore((state = initialState) => state);
};

describe('Sidebar Component', () => {
  let store;
  const initialState = {
    user: {
      id: '123',
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders brand logo and all sidebar routes', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </Provider>
    );

    // Assert brand logo is rendered
    const logo = screen.getByAltText(/Main logo link to home/i);
    expect(logo).toBeInTheDocument();

    // Assert sidebar routes are rendered
    expect(screen.getByText('Account Details')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders Logout item', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout logic when clicking Logout', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </Provider>
    );

    const logoutItem = screen.getByText('Logout');
    fireEvent.click(logoutItem);

    expect(cookie.remove).toHaveBeenCalledWith('token');
    expect(window.localStorage.clear).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
