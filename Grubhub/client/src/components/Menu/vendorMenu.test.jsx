import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VendorMenu from "./vendorMenu";
import { vendorActions } from "../../js/actions/index";
import { MemoryRouter } from "react-router-dom";

// Mock the actions
vi.mock("../../js/actions/index", () => ({
  vendorActions: {
    getMenu: vi.fn(() => ({ type: "GET_MENU" })),
    editSection: vi.fn(() => ({ type: "EDIT_SECTION" })),
    deleteSection: vi.fn(() => ({ type: "DELETE_SECTION" }))
  }
}));

// Mock Sidebar and Navbar to avoid issues with their internal logic/redux
vi.mock("../Sidebar/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

const mockMenu = [
  {
    id: 1,
    section: "Appetizers",
    dishes: [
      {
        id: "d1",
        name: "Spring Rolls",
        description: "Crispy rolls",
        price: 5.99,
        image: "spring-rolls.jpg"
      }
    ]
  },
  {
    id: 2,
    section: "Main Course",
    dishes: [
      {
        id: "d2",
        name: "Pad Thai",
        description: "Stir-fried noodles",
        price: 12.99,
        image: "pad-thai.jpg"
      }
    ]
  }
];

const restaurantInitialState = {
  id: "r1",
  menu: mockMenu
};

const restaurantReducer = (state = restaurantInitialState, action) => {
  return state;
};

const renderWithRedux = (
  component,
  { store = configureStore({ reducer: { restaurant: restaurantReducer } }) } = {}
) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </Provider>
    ),
    store
  };
};

describe("VendorMenu Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders Add Dish button", () => {
    renderWithRedux(<VendorMenu />);
    expect(screen.getByText("Add Dish")).toBeInTheDocument();
  });

  it("renders menu sections and dishes", () => {
    renderWithRedux(<VendorMenu />);
    expect(screen.getByText("Appetizers")).toBeInTheDocument();
    expect(screen.getByText("Spring Rolls")).toBeInTheDocument();
    expect(screen.getByText("Crispy rolls")).toBeInTheDocument();
    expect(screen.getByText("$5.99")).toBeInTheDocument();

    expect(screen.getByText("Main Course")).toBeInTheDocument();
    expect(screen.getByText("Pad Thai")).toBeInTheDocument();
    expect(screen.getByText("Stir-fried noodles")).toBeInTheDocument();
    expect(screen.getByText("$12.99")).toBeInTheDocument();
  });

  it("calls getMenu on mount", () => {
    renderWithRedux(<VendorMenu />);
    expect(vendorActions.getMenu).toHaveBeenCalledWith({
      restaurant_id: "r1"
    });
  });

  it("updates section title and calls editSection", () => {
    renderWithRedux(<VendorMenu />);
    
    const inputs = screen.getAllByPlaceholderText("Update Title");
    fireEvent.change(inputs[0], { target: { value: "New Appetizers", id: "1" } });
    
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);
    
    expect(vendorActions.editSection).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      updated_name: "New Appetizers",
      restaurant_id: "r1"
    }));
  });

  it("calls deleteSection when delete button is clicked", () => {
    renderWithRedux(<VendorMenu />);
    
    const inputs = screen.getAllByPlaceholderText("Update Title");
    fireEvent.change(inputs[1], { target: { value: "Deleted Section", id: "2" } });
    
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[1]);
    
    expect(vendorActions.deleteSection).toHaveBeenCalledWith(expect.objectContaining({
      id: 2,
      updated_name: "Deleted Section",
      restaurant_id: "r1"
    }));
  });
});
