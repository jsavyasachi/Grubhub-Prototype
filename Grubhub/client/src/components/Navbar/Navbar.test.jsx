import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Navigbar from './Navbar';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

const mockStore = (initialState) => {
  return createStore((state = initialState) => state);
};

describe('Navbar Component', () => {
  it('renders brand logo and user first name', () => {
    const initialState = {
      user: {
        id: '123',
        first_name: 'Test',
      },
    };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navigbar />
        </MemoryRouter>
      </Provider>
    );

    // Assert brand logo is rendered
    const logo = screen.getByAltText(/Main logo link to home/i);
    expect(logo).toBeInTheDocument();

    // Assert dropdown title contains user's first name
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
