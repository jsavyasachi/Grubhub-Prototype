import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";

const Navigbar = () => {
  const user = useSelector((state) => state.user) || {};
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    cookie.remove("token");
    localStorage.clear();
    navigate("/");
  };

  const redirect = `\\${user.id}\\search`;

  return (
    <Navbar bg="light" expand="lg" className="fluid">
      <Navbar.Brand href={redirect}>
        <img
          src="https://assets.grubhub.com/assets/img/grubhub/logo-full-primary.svg"
          width="125px"
          height="33px"
          className="d-inline-block align-top"
          alt="Main logo link to home"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto fluid">
          <NavDropdown
            title={user.first_name || ""}
            id="basic-nav-dropdown"
            drop="left"
          >
            <NavDropdown.Item href={`/${user.id}/profile`}>
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item href={`/${user.id}/cart`}>
              Cart
            </NavDropdown.Item>
            <NavDropdown.Item href={`/${user.id}/order`}>
              My Orders
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
              Log Out
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigbar;
