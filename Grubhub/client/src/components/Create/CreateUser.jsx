import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userActions } from "../../js/actions";
import { useDispatch } from "react-redux";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    account_type: "User"
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleCreate = e => {
    e.preventDefault();
    // Pass a shim for the legacy history object used in the action
    dispatch(userActions.registerUser(formData, { history: { push: navigate } }));
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body bg-light">
                <h5 className="card-title text-center">
                  <b>Create your user account</b>
                </h5>
                <form onSubmit={handleCreate}>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="first_name">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        id="first_name"
                        maxLength="30"
                        required
                        autoFocus
                        pattern="[A-Za-z]{1,30}"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        id="last_name"
                        maxLength="30"
                        required
                        pattern="[A-Za-z]{1,30}"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-12">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        maxLength="80"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-12">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        maxLength="80"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row"></div>
                  <button type="submit" className="btn btn-danger btn-block">
                    <b>Create your account</b>
                  </button>
                </form>
                <br></br>
                <p className="text-center">
                  Have an account? <Link to="/login-user">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
