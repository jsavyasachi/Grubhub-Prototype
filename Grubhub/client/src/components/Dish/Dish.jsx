import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { dishActions } from "../../js/actions/index";
import { Container, Row, Col, Image } from "react-bootstrap";
import Sidebar from "../Sidebar/Sidebar";
import { toast } from "react-toastify";

const Dish = () => {
  const { dish_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uploadInput = useRef(null);

  const restaurant_id = useSelector(state => state.restaurant?.id);
  const dish = useSelector(state => state.dish || {});
  const user_id = useSelector(state => state.user?.id);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    section: "",
    price: "",
    image: "",
    restaurant_id: "",
    update: false,
    file: "Choose a file"
  });

  useEffect(() => {
    if (dish_id) {
      dispatch(dishActions.getDish({ dish_id }));
    } else {
      setFormData(prev => ({
        ...prev,
        restaurant_id: restaurant_id,
        update: false
      }));
    }
  }, [dish_id, restaurant_id, dispatch]);

  useEffect(() => {
    if (dish && dish.id && dish_id) {
      setFormData({
        id: dish.id,
        name: dish.name || "",
        description: dish.description || "",
        section: dish.section || "",
        price: dish.price || "",
        image: dish.image || "",
        restaurant_id: restaurant_id,
        update: true,
        file: "Choose a file"
      });
    }
  }, [dish, dish_id, restaurant_id]);

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleUpdate = e => {
    e.preventDefault();
    dispatch(dishActions.updateDish(formData));
  };

  const handleAdd = e => {
    e.preventDefault();
    dispatch(dishActions.addDish(formData));
  };

  const handleDelete = e => {
    e.preventDefault();
    const payload = {
      user_id: user_id,
      dish_id: formData.id
    };
    // Note: dishActions.deleteDish expects ownProps.history.push
    // Since we are using Hooks, we might need to update the action or handle navigation here.
    // However, the requirement says "verify they are called correctly".
    // I'll stick to calling the action. 
    // If the action needs history, I should ideally pass navigate or update the action.
    // For now, I'll pass a mock history to maintain compatibility if possible, 
    // or just assume the action might be updated later.
    dispatch(dishActions.deleteDish(payload, { history: { push: navigate } }));
  };

  const handleUpload = e => {
    e.preventDefault();
    const path = new FormData();
    if (uploadInput.current.files && uploadInput.current.files.length) {
      path.append("file", uploadInput.current.files[0]);
      dispatch(dishActions.uploadDishImage(path));
    } else {
      toast.warning("No image selected for upload!");
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="container shadow p-4 col-sm-9 col-md-7 col-lg-5 mx-auto">
        <form>
          <div className="form-group mx-auto align-center">
            <Container style={{ width: "30rem" }}>
              <Row>
                <Col xs={6} md={4}>
                  <Image
                    src={formData.image || ""}
                    roundedCircle
                    width="250px"
                    height="250px"
                  />
                </Col>
              </Row>
            </Container>
          </div>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="name">Dish Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="section">Section</label>
              <input
                type="text"
                className="form-control"
                id="section"
                value={formData.section}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-3">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                className="form-control"
                id="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="image">Dish Image</label>
            <div className="form-inline col-md-12 image-upload">
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="image"
                  accept="image/*"
                  ref={uploadInput}
                  aria-describedby="fileUpload"
                  onChange={e => {
                    if (e.target.value) {
                      let fileName = e.target.value.split("\\");
                      setFormData(prev => ({
                        ...prev,
                        file: fileName && fileName.length
                          ? fileName[fileName.length - 1]
                          : "Choose a file"
                      }));
                    }
                  }}
                />
              </div>
              <label
                className="custom-file-label"
                id="image-label"
                htmlFor="image"
              >
                {formData.file}
              </label>
            </div>
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary m-2"
                type="button"
                id="fileUpload"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          </div>

          {formData.update ? (
            <div className="form-row">
              <div className="col text-center">
                <button
                  type="submit"
                  className="btn btn-danger m-3"
                  onClick={handleUpdate}
                >
                  Update Dish
                </button>
              </div>
              <div className="col text-center">
                <button
                  type="submit"
                  className="btn btn-danger m-3"
                  onClick={handleDelete}
                >
                  Delete Dish
                </button>
              </div>
            </div>
          ) : (
            <div className="form-row">
              <div className="col text-center">
                <button
                  type="submit"
                  className="btn btn-primary m-3"
                  onClick={handleAdd}
                >
                  Add Dish
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Dish;
