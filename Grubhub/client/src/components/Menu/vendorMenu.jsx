import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { vendorActions } from "../../js/actions/index";
import _ from "lodash";
import { Container, Row, Card } from "react-bootstrap";
import Sidebar from "../Sidebar/Sidebar";

const VendorMenu = () => {
  const dispatch = useDispatch();
  const restaurant = useSelector((state) => state.restaurant);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (restaurant.id) {
      dispatch(vendorActions.getMenu({ restaurant_id: restaurant.id }));
    }
  }, [dispatch, restaurant.id]);

  useEffect(() => {
    if (restaurant.menu && restaurant.menu.length) {
      const newSections = restaurant.menu.map((eachSection) => ({
        name: eachSection.section,
        id: eachSection.id,
        dishes: _.map(eachSection.dishes, "id"),
        updated_name: "",
      }));
      setSections(newSections);
    }
  }, [restaurant.menu]);

  const handleChange = (e) => {
    e.preventDefault();
    const key = parseInt(e.currentTarget.id);
    const value = e.currentTarget.value;
    
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === key ? { ...section, updated_name: value } : section
      )
    );
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const sectionId = parseInt(e.currentTarget.value);
    const actionName = e.currentTarget.name;
    const currentSection = sections.find((s) => s.id === sectionId);

    if (currentSection && currentSection.updated_name) {
      const payload = {
        ...currentSection,
        restaurant_id: restaurant.id,
      };

      if (actionName === "edit") {
        dispatch(vendorActions.editSection(payload));
      } else if (actionName === "delete") {
        dispatch(vendorActions.deleteSection(payload));
      }
    }
  };

  return (
    <div>
      <Sidebar />
      <Container className="vendorMenu">
        <Row className="p-2 col-sm-9 col-md-7 col-lg-2 mx-auto hover-right">
          <Link to="/dish">
            <button type="submit" className="btn btn-danger m-3">
              Add Dish
            </button>
          </Link>
        </Row>
        <div className="container shadow p-4 col-sm-9 mx-auto">
          {restaurant.menu && restaurant.menu.length
            ? restaurant.menu.map((eachSection) => {
                return (
                  <Container key={eachSection.section}>
                    <Row>
                      <div>
                        <label className="col-sm-2 col-form-label col-form-label-lg">
                          {eachSection.section}
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            onChange={handleChange}
                            key={eachSection.id}
                            id={eachSection.id}
                            placeholder="Update Title"
                            aria-describedby="button-addon4"
                          />
                          <div className="input-group-append" id="button-addon4">
                            <button
                              className="btn btn-outline-danger"
                              type="button"
                              name="edit"
                              value={eachSection.id}
                              onClick={handleEdit}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              type="button"
                              name="delete"
                              value={eachSection.id}
                              onClick={handleEdit}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </Row>
                    <Row>
                      <Container>
                        <Row>
                          {eachSection.dishes.map((dish) => {
                            const dishDetailLink = `/dish/detail/${dish.id}`;
                            return (
                              <Link key={dish.id} to={dishDetailLink}>
                                <div className="m-2">
                                  <Card style={{ width: "12rem" }}>
                                    <Card.Img
                                      variant="top"
                                      src={dish.image}
                                      width="60px"
                                      height="90px"
                                    />
                                    <Card.Body>
                                      <Card.Title>{dish.name}</Card.Title>
                                      <Card.Text>
                                        <label>{dish.description}</label>
                                        <br />
                                        <label>${dish.price}</label>
                                      </Card.Text>
                                    </Card.Body>
                                  </Card>
                                </div>
                              </Link>
                            );
                          })}
                        </Row>
                      </Container>
                    </Row>
                  </Container>
                );
              })
            : null}
        </div>
      </Container>
    </div>
  );
};

export default VendorMenu;
