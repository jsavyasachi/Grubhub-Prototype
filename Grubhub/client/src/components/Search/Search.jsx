import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { buyerActions } from "../../js/actions/index";
import Navigbar from "../Navbar/Navbar";

const Search = (props) => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = e => {
    setSearch(e.target.value);
  };

  const handleSearch = e => {
    e.preventDefault();
    const payload = {
      search: search
    };
    dispatch(buyerActions.getResults(payload, { ...props, history: { push: navigate } }));
  };

  return (
    <div>
      <Navigbar></Navigbar>
      <div className="container p-4 col-sm-7">
        <form onSubmit={handleSearch}>
          <div className="row">
            <div className="col text-center">
              <div className="form-group active-cyan-4 mb-4">
                <input
                  className="form-control mr-sr-m2"
                  type="text"
                  id="search"
                  placeholder="Search for Dishes Here"
                  aria-label="Search"
                  onChange={handleChange}
                  value={search}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <button type="submit" className="btn btn-danger">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
