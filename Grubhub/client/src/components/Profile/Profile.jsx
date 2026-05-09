import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions, vendorActions } from "../../js/actions/index";
import { ToastContainer, toast } from "react-toastify";
import { Container, Row, Col, Image } from "react-bootstrap";
import Navigbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./style.css";

const Profile = () => {
  const user = useSelector(state => state.user);
  const restaurant = useSelector(state => state.restaurant);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    account_type: "",
    image: "",
    restaurant_id: "",
    restaurant_name: "",
    restaurant_address: "",
    restaurant_zipcode: "",
    restaurant_image: "",
    cuisine: "",
    profile_pic_file: "Choose a file",
    restaurant_pic_file: "Choose a file"
  });

  const uploadProfileRef = useRef(null);
  const uploadRestaurantRef = useRef(null);

  useEffect(() => {
    if (user && user.account_type === "Vendor" && user.id) {
      dispatch(vendorActions.getRestaurant({ user_id: user.id }));
    }
  }, [user.id, user.account_type, dispatch]);

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      id: user.id || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      account_type: user.account_type || "",
      address: user.address || "",
      image: user.image || "",
      restaurant_id: restaurant.id || "",
      restaurant_name: restaurant.name || "",
      restaurant_address: restaurant.address || "",
      restaurant_zipcode: restaurant.zipcode || "",
      restaurant_image: restaurant.image || "",
      cuisine: restaurant.cuisine || ""
    }));
  }, [user, restaurant]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleUpdate = e => {
    e.preventDefault();
    dispatch(userActions.updateUser(formData));
  };

  const handleUpload = e => {
    e.preventDefault();
    const path = new FormData();
    if (e.target.value === "profile_pic") {
      if (uploadProfileRef.current.files && uploadProfileRef.current.files.length) {
        path.append("file", uploadProfileRef.current.files[0] || "");
        dispatch(userActions.uploadProfileImage(path));
      } else {
        toast.warning("No image selected for upload!");
      }
    } else if (e.target.value === "restaurant_pic") {
      if (uploadRestaurantRef.current.files && uploadRestaurantRef.current.files.length) {
        path.append("file", uploadRestaurantRef.current.files[0] || "");
        dispatch(vendorActions.uploadRestaurantImage(path));
      } else {
        toast.warning("No image selected for upload!");
      }
    }
  };

  return (
    <div>
      {formData.account_type === "Vendor" ? <Sidebar /> : <Navigbar />}
      <div className="form-row">
        <div className="container shadow p-4 col-sm-9 col-md-7 col-lg-5 mx-auto">
          <form onSubmit={handleUpdate}>
            <div className="form-group" style={{ width: "30 rem" }}>
              <Container>
                <Row>
                  <Col xs={3} md={2}>
                    <Image
                      src={formData.image}
                      roundedCircle
                      width="250px"
                      height="250px"
                    />
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-8">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  readOnly
                ></input>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-8">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="address">Address</label>
                <textarea
                  className="form-control"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group image-upload">
              <label htmlFor="file"> Profile Image</label>
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="file"
                  accept="image/*"
                  ref={uploadProfileRef}
                  aria-describedby="fileUpload"
                  onChange={e => {
                    if (e.target.value) {
                      let fileName = e.target.value.split("\\");
                      setFormData({
                        ...formData,
                        profile_pic_file:
                          fileName && fileName.length
                            ? fileName[fileName.length - 1]
                            : "Choose file"
                      });
                    }
                  }}
                />
                <label
                  className="custom-file-label"
                  id="image-label"
                  htmlFor="file"
                >
                  {formData.profile_pic_file}
                </label>
              </div>
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary m-2"
                  type="button"
                  id="fileUpload"
                  value="profile_pic"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              </div>
            </div>
            {formData.account_type === "Vendor" ? (
              <div>
                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="restaurant_name">Restaurant Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="restaurant_name"
                      value={formData.restaurant_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="cuisine">Cuisine</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cuisine"
                      value={formData.cuisine}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="restaurant_address">
                      Restaurant Address
                    </label>
                    <textarea
                      className="form-control"
                      id="restaurant_address"
                      value={formData.restaurant_address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="restaurant_zipcode">
                      Restaurant Zipcode
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="restaurant_zipcode"
                      value={formData.restaurant_zipcode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ width: "30rem" }}>
                  <Container>
                    <Row>
                      <Col xs={6} md={4}>
                        <Image
                          src={formData.restaurant_image}
                          rounded
                          width="250px"
                          height="250px"
                        />
                      </Col>
                    </Row>
                  </Container>
                </div>
                <div className="form-group image-upload">
                  <label htmlFor="restaurant_file">Restaurant Image</label>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="restaurant_file"
                      accept="image/*"
                      ref={uploadRestaurantRef}
                      aria-describedby="fileUploadRestaurant"
                      onChange={e => {
                        if (e.target.value) {
                          let fileName = e.target.value.split("\\");
                          setFormData({
                            ...formData,
                            restaurant_pic_file:
                              fileName && fileName.length
                                ? fileName[fileName.length - 1]
                                : "Choose file"
                          });
                        }
                      }}
                    />
                    <label
                      className="custom-file-label"
                      id="image-label-restaurant"
                      htmlFor="restaurant_file"
                    >
                      {formData.restaurant_pic_file}
                    </label>
                  </div>
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary m-2"
                      type="button"
                      id="fileUploadRestaurant"
                      value="restaurant_pic"
                      onClick={handleUpload}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="row">
              <div className="col text-center">
                <button type="submit" className="btn btn-danger m-3">
                  Update
                </button>
              </div>
            </div>
          </form>
          <ToastContainer autoClose={2000} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
