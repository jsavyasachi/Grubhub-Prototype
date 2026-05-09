import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginUser from "./Login/LoginUser";
import LoginVendor from "./Login/LoginVendor";
import LandingPage from "./LandingPage/LandingPage";
import CreateUser from "./Create/CreateUser";
import CreateVendor from "./Create/CreateVendor";
import Profile from "./Profile/Profile";
import Dish from "./Dish/Dish";
import vendorMenu from "./Menu/vendorMenu";
import Search from "./Search/Search";
import OrderDetails from "./Order/OrderDetails";
import Cart from "./Cart/Cart";
import SearchResults from "./Search/SearchResults";
import Restaurant from "./Restaurant/Restaurant";
import OrderList from "./Order/OrderList";

class Main extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login-user" element={<LoginUser />} />
            <Route path="/login-vendor" element={<LoginVendor />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/create-vendor" element={<CreateVendor />} />

            <Route path="/:id/profile" element={<Profile />} />
            <Route path="/:id/cart" element={<Cart />} />
            <Route path="/:id/order" element={<OrderList />} />
            <Route path="/:id/menu" element={<vendorMenu />} />
            <Route path="/:id/search" element={<Search />} />
            <Route path="/results" element={<SearchResults />} />

            <Route path="/dish" element={<Dish />} />
            <Route path="/dish/detail/:dish_id" element={<Dish />} />
            <Route
              path="/order/detail/:order_id"
              element={<OrderDetails />}
            />
            <Route
              path="/restaurant/detail/:restaurant_id"
              element={<Restaurant />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default Main;
