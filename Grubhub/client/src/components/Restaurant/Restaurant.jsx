import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { buyerActions } from "../../js/actions/index";
import { Container, Row, Card, Form, Col } from "react-bootstrap";
import _ from "lodash";
import Navigbar from "../Navbar/Navbar";
import "./style.css";

const Restaurant = () => {
  const { restaurant_id } = useParams();
  const dispatch = useDispatch();
  
  const current_restaurant = useSelector(state => state.buyer.current_restaurant) || {
    id: "",
    name: "",
    cuisine: "",
    address: "",
    zipcode: "",
    image: "",
    menu: []
  };

  const [cart, setCart] = useState({});

  useEffect(() => {
    dispatch(buyerActions.getRestaurantDetails({ restaurant_id }));
  }, [dispatch, restaurant_id]);

  const handleQuantity = e => {
    let value = parseInt(e.target.value);
    if (value < 0) {
      value = 0;
    } else if (value > 10) {
      value = 10;
    }
    
    setCart(prevCart => ({
      ...prevCart,
      [e.target.id]: value
    }));
  };

  const handleAddToCart = e => {
    e.preventDefault();
    const dishes = _.chain(current_restaurant.menu)
      .map("dishes")
      .concat()
      .flatten()
      .value();

    if (dishes && dishes.length) {
      const cartItems = dishes.map(dish => {
        if (cart[dish.id] && cart[dish.id] !== 0) {
          return {
            id: dish.id,
            name: dish.name,
            quantity: cart[dish.id].toString(), // Original used string from e.target.value eventually
            price: dish.price ? dish.price * cart[dish.id] : 0
          };
        }
        return null;
      });
      
      dispatch(buyerActions.addToCart({
        cart: _.compact(cartItems)
      }));
    }
  };

  return (
    <div>
      <Navigbar />
      <div className="form-group row restaurant_title">
        <div className="image-container">
          <img
            src={current_restaurant.image}
            className="img-thumbnail"
            alt="Oops, restaurant has no image..."
          />
        </div>
        <div className="restaurant_name">
          <h1>{current_restaurant.name}</h1>
          <h5>{current_restaurant.address}</h5>
        </div>
      </div>
      <div className="restaurant-detail">
        <div className="container">
          <h3 className="menu">Menu</h3>
          {current_restaurant.menu && current_restaurant.menu.length
            ? current_restaurant.menu.map((eachSection, index) => {
                return (
                  <div className="section" key={index}>
                    <h4>{eachSection.section}</h4>
                    <div>
                      <Container>
                        <Row>
                          {eachSection.dishes.map(dish => {
                            return (
                              <div className="m-2" key={dish.id}>
                                <Card
                                  style={{ width: "14rem", height: "20rem" }}
                                >
                                  <Card.Img
                                    variant="top"
                                    src={dish.image}
                                    width="60px"
                                    height="90px"
                                  />
                                  <Card.Body>
                                    <Card.Title>{dish.name}</Card.Title>
                                    <Card.Text as="div">
                                      <label>{dish.description}</label>
                                      <br></br>
                                      <label>${dish.price}</label>
                                      <Form.Group as={Row}>
                                        <Form.Label column sm="6">
                                          Quantity
                                        </Form.Label>
                                        <Col sm="6">
                                          <Form.Control
                                            type="number"
                                            placeholder=""
                                            min="0"
                                            max="10"
                                            id={dish.id}
                                            value={cart[dish.id] || ""}
                                            onChange={handleQuantity}
                                          />
                                        </Col>
                                      </Form.Group>
                                    </Card.Text>
                                  </Card.Body>
                                </Card>
                              </div>
                            );
                          })}
                        </Row>
                      </Container>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
        <button
          type="submit"
          className="btn btn-danger m-3 float-right"
          onClick={handleAddToCart}
        >
          Add Selected Dishes to Cart
        </button>
      </div>
    </div>
  );
};

export default Restaurant;
