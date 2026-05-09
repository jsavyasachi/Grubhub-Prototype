import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Dish from "./Dish";
import { dishActions } from "../../js/actions/index";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock the actions
vi.mock("../../js/actions/index", () => ({
  dishActions: {
    addDish: vi.fn(() => ({ type: "ADD_DISH" })),
    deleteDish: vi.fn(() => ({ type: "DELETE_DISH" })),
    updateDish: vi.fn(() => ({ type: "UPDATE_DISH" })),
    getDish: vi.fn(() => ({ type: "GET_DISH" })),
    uploadDishImage: vi.fn(() => ({ type: "UPLOAD_DISH_IMAGE" }))
  }
}));

// Mock Sidebar to avoid issues with its internal logic/redux
vi.mock("../Sidebar/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

const mockDish = {
  id: "d1",
  name: "Pasta",
  description: "Delicious pasta",
  section: "Main",
  price: "15",
  image: "pasta.jpg"
};

const initialState = {
  restaurant: { id: "r1" },
  dish: {},
  user: { id: "u1" }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DISH":
      return { ...state, dish: action.payload };
    default:
      return state;
  }
};

const renderWithRedux = (
  component,
  { 
    store = configureStore({ 
      reducer: { 
        restaurant: (state = initialState.restaurant) => state,
        dish: (state = initialState.dish) => state,
        user: (state = initialState.user) => state
      } 
    }),
    route = "/dish"
  } = {}
) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/dish" element={component} />
            <Route path="/dish/:dish_id" element={component} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
    store
  };
};

describe("Dish Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders form fields correctly", () => {
    renderWithRedux(<Dish />);
    expect(screen.getByLabelText(/Dish Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Section/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
  });

  it("renders 'Add Dish' button when no dish_id is provided", () => {
    renderWithRedux(<Dish />);
    expect(screen.getByRole("button", { name: /Add Dish/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Update Dish/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Delete Dish/i })).not.toBeInTheDocument();
  });

  it("renders 'Update Dish' and 'Delete Dish' buttons when dish_id is provided", () => {
    const storeWithDish = configureStore({
      reducer: {
        restaurant: () => ({ id: "r1" }),
        dish: () => mockDish,
        user: () => ({ id: "u1" })
      }
    });

    renderWithRedux(<Dish />, { 
        store: storeWithDish,
        route: "/dish/d1"
    });

    expect(screen.getByRole("button", { name: /Update Dish/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Delete Dish/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Add Dish/i })).not.toBeInTheDocument();
  });

  it("calls addDish action on 'Add Dish' button click", () => {
    renderWithRedux(<Dish />);
    
    fireEvent.change(screen.getByLabelText(/Dish Name/i), { target: { value: "New Dish", id: "name" } });
    fireEvent.click(screen.getByRole("button", { name: /Add Dish/i }));
    
    expect(dishActions.addDish).toHaveBeenCalled();
    const callArgs = dishActions.addDish.mock.calls[0][0];
    expect(callArgs.name).toBe("New Dish");
  });

  it("calls updateDish action on 'Update Dish' button click", () => {
    const storeWithDish = configureStore({
      reducer: {
        restaurant: () => ({ id: "r1" }),
        dish: () => mockDish,
        user: () => ({ id: "u1" })
      }
    });

    renderWithRedux(<Dish />, { 
        store: storeWithDish,
        route: "/dish/d1" 
    });

    fireEvent.change(screen.getByLabelText(/Dish Name/i), { target: { value: "Updated Dish", id: "name" } });
    fireEvent.click(screen.getByRole("button", { name: /Update Dish/i }));
    
    expect(dishActions.updateDish).toHaveBeenCalled();
    const callArgs = dishActions.updateDish.mock.calls[0][0];
    expect(callArgs.name).toBe("Updated Dish");
  });

  it("calls deleteDish action on 'Delete Dish' button click", () => {
    const storeWithDish = configureStore({
      reducer: {
        restaurant: () => ({ id: "r1" }),
        dish: () => mockDish,
        user: () => ({ id: "u1" })
      }
    });

    renderWithRedux(<Dish />, { 
        store: storeWithDish,
        route: "/dish/d1" 
    });

    fireEvent.click(screen.getByRole("button", { name: /Delete Dish/i }));
    
    expect(dishActions.deleteDish).toHaveBeenCalled();
  });
});
