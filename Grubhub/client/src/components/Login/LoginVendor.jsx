import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../../js/actions/index";
import { ToastContainer } from "react-toastify";

const LoginVendor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Shim for ownProps.history
  const history = {
    push: (path) => navigate(path)
  };

  const handleVendorLogin = (e) => {
    e.preventDefault();
    const payload = { email, password };
    dispatch(userActions.loginUser(payload, { history }));
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body bg-light">
                <h5 className="card-title text-center">
                  <b>Sign in with your Grubhub vendor account</b>
                </h5>
                <form
                  className="form-signin"
                  onSubmit={handleVendorLogin}
                >
                  <div className="form-row"></div>
                  <div className="form-label-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <br></br>

                  <div className="form-label-group">
                    <button
                      className="btn btn-danger btn-block"
                      type="submit"
                    >
                      <b>Sign in</b>
                    </button>
                  </div>
                </form>
                <ToastContainer autoClose={2000} />

                <br></br>
                <Link to="/create-vendor">
                  <p className="text-center">Create Vendor Account</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginVendor;
