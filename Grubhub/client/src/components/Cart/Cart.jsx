import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import _ from "lodash";
import { buyerActions } from "../../js/actions/index";
import empty from "../../images/emptyCart.svg";
import { Image } from "react-bootstrap";
import "./style.css";
import Navigbar from "../Navbar/Navbar";

const Cart = () => {
  const cart = useSelector(state => state.buyer.cart);
  const user_id = useSelector(state => state.user.id);
  const restaurant_id = useSelector(state => state.buyer.current_restaurant.id);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart_columns = [
    {
      dataField: "name",
      text: "Dish Name"
    },
    {
      dataField: "quantity",
      text: "Quantity"
    },
    {
      dataField: "price",
      text: "Price"
    }
  ];

  const total_amount = useMemo(() => {
    return cart && cart.length
      ? _.chain(cart)
          .map("price")
          .reduce((sum, dish) => sum + dish, 0)
          .value()
      : 0;
  }, [cart]);

  const handlePlaceOrder = e => {
    e.preventDefault();
    const ownPropsShim = {
      history: {
        replace: (path) => navigate(path, { replace: true }),
        push: (path) => navigate(path)
      }
    };
    dispatch(buyerActions.placeOrder({
      cart,
      total_amount,
      user_id,
      restaurant_id
    }, ownPropsShim));
  };

  return (
    <div>
      <Navigbar />
      <div className="cart">
        {cart && cart.length ? (
          <div>
            <BootstrapTable
              keyField="name"
              data={cart}
              columns={cart_columns}
              bordered={true}
              hover
              condensed
              striped
            />
            <div>
              <h6 className="float-right">
                Total Amount Due at checkout: ${total_amount}
              </h6>
            </div>
            <br></br>
            <br></br>
            <div className="place_order">
              <button
                id="placeOrder"
                className="btn btn-danger float-right"
                onClick={handlePlaceOrder}
              >
                Confirm Order
              </button>
            </div>
          </div>
        ) : (
          <div className="empty_cart">
            <Image src={empty} rounded width="200px" height="200px" />
            <h3>There is nothing in your cart...</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
