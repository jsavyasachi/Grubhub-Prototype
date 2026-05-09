import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import BootstrapTable from "react-bootstrap-table-next";
import { vendorActions, userActions } from "../../js/actions/index";
import Sidebar from "../Sidebar/Sidebar";
import Navigationbar from "../Navbar/Navbar";

const OrderList = () => {
  const { id: urlId } = useParams();
  const dispatch = useDispatch();
  
  const user = useSelector(state => state.user);
  const restaurant = useSelector(state => state.restaurant);
  const order = useSelector(state => state.order);

  const { current_orders = [], past_orders = [] } = order || {};

  useEffect(() => {
    if (user.account_type === "Vendor") {
      if (!restaurant.id) {
        dispatch(vendorActions.getRestaurant({ user_id: urlId }));
      } else {
        dispatch(vendorActions.getRestaurantOrders({ id: restaurant.id }));
      }
    } else if (user.account_type === "User") {
      dispatch(vendorActions.getBuyerOrders({ id: urlId }));
    }
  }, [dispatch, user.account_type, restaurant.id, urlId]);

  const orderIdFormatter = (cell, row) => {
    let detailpage_link = `/order/detail/${row.id}`;
    return <Link to={detailpage_link}>{cell}</Link>;
  };

  const afterSaveCell = (oldValue, newValue, row) => {
    const payload = {
      id: row.id,
      status: row.status
    };
    dispatch(vendorActions.changeStatus(payload));
  };

  const past_orders_columns = useMemo(() => [
    {
      dataField: "id",
      text: "ID",
      formatter: orderIdFormatter
    },
    {
      dataField: "amount",
      text: "Amount"
    },
    {
      dataField: "status",
      text: "Status"
    }
  ], []);

  const current_order_columns = useMemo(() => [
    {
      dataField: "id",
      text: "ID",
      formatter: orderIdFormatter
    },
    {
      dataField: "amount",
      text: "Amount"
    },
    {
      dataField: "status",
      text: "Status",
      editor: {
        type: Type.SELECT,
        options: [
          { label: "New", value: "NEW" },
          { label: "Preparing", value: "PREPARING" },
          { label: "Ready", value: "READY" },
          { label: "Delivered", value: "DELIVERED" },
          { label: "Cancelled", value: "CANCELLED" }
        ]
      }
    }
  ], []);

  return (
    <div>
      {user.account_type === "Vendor" ? (
        <Sidebar />
      ) : (
        <Navigationbar />
      )}
      <div className="order_list">
        <div>
          <h3>Current Orders</h3>
        </div>
        <div>
          <BootstrapTable
            keyField="id"
            data={current_orders}
            columns={current_order_columns}
            bordered={true}
            hover
            condensed
            striped
            cellEdit={user.account_type === "Vendor" ? cellEditFactory({
              mode: "click",
              blurToSave: true,
              afterSaveCell: (oldValue, newValue, row) => {
                afterSaveCell(oldValue, newValue, row);
              }
            }) : undefined}
          />
        </div>

        <div>
          <h3>Previous Orders</h3>
        </div>
        <div>
          <BootstrapTable
            keyField="id"
            data={past_orders}
            columns={past_orders_columns}
            bordered={true}
            hover
            condensed
            striped
          />
        </div>
      </div>
    </div>
  );
};

export default OrderList;
