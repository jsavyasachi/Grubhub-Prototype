import React from "react";
import { Navbar, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./style.css";
import { NavLink, useNavigate } from "react-router-dom";
import cookie from "js-cookie";

const sidebarRoutes = {
  vendor: [
    {
      url: "/profile",
      name: "Account Details"
    },
    {
      url: "/order",
      name: "Orders"
    },
    {
      url: "/menu",
      name: "Menu"
    }
  ]
};

const Sidebar = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  const userId = user?.id || "";

  const handleLogout = e => {
    e.preventDefault();
    cookie.remove("token");
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="fixed">
      <nav className="sidebar flex-column">
        <ListGroup variant="flush">
          <ListGroup.Item variant="danger">
            <Navbar.Brand href={`/${userId}/profile`}>
              <img
                src="https://assets.grubhub.com/assets/img/grubhub/logo-full-primary.svg"
                width="125px"
                height="33px"
                className="d-inline-block align-top"
                alt="Main logo link to home"
              />
            </Navbar.Brand>
          </ListGroup.Item>
          {sidebarRoutes.vendor.map((route) => {
            return (
              <NavLink
                key={`/${userId}${route.url}`}
                to={`/${userId}${route.url}`}
              >
                <ListGroup.Item
                  action
                  variant="danger"
                >
                  {route.name}
                </ListGroup.Item>
              </NavLink>
            );
          })}
          <ListGroup.Item action variant="danger" onClick={handleLogout}>
            Logout
          </ListGroup.Item>
        </ListGroup>
      </nav>
    </div>
  );
};

export default Sidebar;
