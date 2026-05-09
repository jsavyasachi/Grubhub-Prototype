import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Restaurant from "./Restaurant";
import { buyerActions } from "../../js/actions/index";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock the actions
vi.mock("../../js/actions/index", () => ({
  buyerActions: {
    getRestaurantDetails: vi.fn(() => ({ type: "GET_RESTAURANT_DETAILS" })),
    addToCart: vi.fn(() => ({ type: "ADD_TO_CART" }))
  }
}));

// Mock Navbar to avoid issues with its internal logic/redux
vi.mock("../Navbar/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

const mockRestaurant = {
  id: "1",
  name: "Test Restaurant",
  address: "123 Test St",
  image: "test-image.jpg",
  menu: [
    {
      section: "Burgers",
      dishes: [
        {
          id: "d1",
          name: "Cheese Burger",
          description: "Yummy cheese burger",
          price: 10,
          image: "burger.jpg"
        }
      ]
    }
  ]
};

const buyerInitialState = {
  current_restaurant: mockRestaurant
};

const buyerReducer = (state = buyerInitialState, action) => {
  return state;
};

const renderWithRedux = (
  component,
  { store = configureStore({ reducer: { buyer: buyerReducer } }) } = {}
) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/restaurant/1"]}>
          <Routes>
            <Route path="/restaurant/:restaurant_id" element={component} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
    store
  };
};

describe("Restaurant Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders restaurant name and address", () => {
    renderWithRedux(<Restaurant />);
    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    expect(screen.getByText("123 Test St")).toBeInTheDocument();
  });

  it("renders menu sections and dishes", () => {
    renderWithRedux(<Restaurant />);
    expect(screen.getByText("Burgers")).toBeInTheDocument();
    expect(screen.getByText("Cheese Burger")).toBeInTheDocument();
    expect(screen.getByText("Yummy cheese burger")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
  });

  it("calls getRestaurantDetails on mount", () => {
    renderWithRedux(<Restaurant />);
    expect(buyerActions.getRestaurantDetails).toHaveBeenCalledWith({
      restaurant_id: "1"
    });
  });

  it("updates quantity and calls addToCart with correct data", () => {
    renderWithRedux(<Restaurant />);
    
    const quantityInput = screen.getByPlaceholderText("");
    fireEvent.change(quantityInput, { target: { value: "2", id: "d1" } });
    
    const addToCartButton = screen.getByText("Add Selected Dishes to Cart");
    fireEvent.click(addToCartButton);
    
    expect(buyerActions.addToCart).toHaveBeenCalledWith({
      cart: [
        {
          id: "d1",
          name: "Cheese Burger",
          quantity: "2",
          price: 20
        }
      ]
    });
  });
});
