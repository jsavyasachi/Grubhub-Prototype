import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
import Nabvigbar from "../Navbar/Navbar";

const SearchResults = () => {
  const search_results = useSelector(state => state.buyer.search_results);

  const cuisines = useMemo(() => {
    return search_results && search_results.length
      ? _.chain(search_results)
          .map("cuisine")
          .uniq()
          .map(each => ({
            value: each,
            label: each
          }))
          .value()
      : [];
  }, [search_results]);

  const restaurantNameFormatter = (cell, row) => {
    let detailpage_link = `/restaurant/detail/${row.id}`;
    return <Link to={detailpage_link}>{cell}</Link>;
  };

  const restaurant_list_columns = useMemo(() => [
    {
      dataField: "id",
      text: "ID",
      hidden: true
    },
    {
      dataField: "name",
      text: "Name",
      formatter: restaurantNameFormatter
    },
    {
      dataField: "address",
      text: "Location"
    },
    {
      dataField: "cuisine",
      text: "Cuisine",
      formatter: cell =>
        cuisines.filter(opt => opt.label === cell)[0]?.label || "",
      filter: selectFilter({
        options: cuisines
      })
    }
  ], [cuisines]);

  return (
    <div>
      <Nabvigbar></Nabvigbar>
      {search_results && search_results.length ? (
        <div className="container shadow">
          <BootstrapTable
            keyField="id"
            data={search_results}
            columns={restaurant_list_columns}
            filter={filterFactory()}
            bordered={true}
            hover
            condensed
            striped
          />
        </div>
      ) : (
        <div className="container shadow mx-auto">
          <p>
            Could find any restaurant serving this. Try finding another dish?
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
