import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { buyerActions } from "../../js/actions/index";

// Mock buyerActions
vi.mock("../../js/actions/index", () => ({
  buyerActions: {
    placeOrder: vi.fn(() => ({ type: 'PLACE_ORDER' }))
  }
}));

// Mock Navbar as it might have its own dependencies
vi.mock("../Navbar/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

const mockStore = (initialState) => {
  return createStore((state = initialState) => state);
};

describe('Cart Component', () => {
  let store;
  const filledState = {
    buyer: {
      cart: [
        { name: "Dish 1", quantity: 2, price: 20 },
        { name: "Dish 2", quantity: 1, price: 15 }
      ],
      current_restaurant: {
        id: "rest1"
      }
    },
    user: {
      id: "user1"
    }
  };

  const emptyState = {
    buyer: {
      cart: [],
      current_restaurant: {
        id: "rest1"
      }
    },
    user: {
      id: "user1"
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders items correctly and displays the total amount', () => {
    store = mockStore(filledState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Dish 1')).toBeInTheDocument();
    expect(screen.getByText('Dish 2')).toBeInTheDocument();
    // Total amount: 20 + 15 = 35
    expect(screen.getByText(/Total Amount Due at checkout: \$35/i)).toBeInTheDocument();
  });

  it('calls placeOrder when "Confirm Order" button is clicked', () => {
    store = mockStore(filledState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );

    const confirmButton = screen.getByText('Confirm Order');
    fireEvent.click(confirmButton);

    expect(buyerActions.placeOrder).toHaveBeenCalled();
    const callArgs = vi.mocked(buyerActions.placeOrder).mock.calls[0][0];
    expect(callArgs).toMatchObject({
      cart: filledState.buyer.cart,
      total_amount: 35,
      user_id: "user1",
      restaurant_id: "rest1"
    });
  });

  it('renders empty cart message when cart is empty', () => {
    store = mockStore(emptyState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('There is nothing in your cart...')).toBeInTheDocument();
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toBeTruthy();
  });
});
