import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { vendorActions } from "../../js/actions";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import Sidebar from "../Sidebar/Sidebar";
import Navigationbar from "../Navbar/Navbar";
import "./style.css";

const columns = [
  {
    dataField: "name",
    text: "Name"
  },
  {
    dataField: "quantity",
    text: "Quantity"
  }
];

const Orderdetails = () => {
  const { order_id } = useParams();
  const dispatch = useDispatch();
  const activeOrder = useSelector(state => state.order.active);
  const user = useSelector(state => state.user);

  useEffect(() => {
    const payload = {
      order_id: order_id
    };
    dispatch(vendorActions.getOrderDetails(payload));
  }, [dispatch, order_id]);

  const order = {
    id: activeOrder?.id || "",
    name: activeOrder?.buyer?.name || "",
    address: activeOrder?.buyer?.address || "",
    status: activeOrder?.status || "",
    amount: activeOrder?.amount || "",
    dishes: activeOrder?.dishes || []
  };

  return (
    <div>
      {user.account_type === "Vendor" ? (
        <Sidebar />
      ) : (
        <Navigationbar />
      )}
      <div className="container shadow p-4 col-sm-9 col-md-7 col-lg-5 mx-auto">
        <form>
          <div className="form-group row">
            <label
              htmlFor="orderId"
              className="col-sm-2 col-form-label col-form-label-lg"
            >
              Order ID
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control form-control-lg order_detail_input"
                id="orderId"
                value={order.id}
                readOnly
              ></input>
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="buyerName"
              className="col-sm-2 col-form-label col-form-label-lg"
            >
              Buyer Name
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control form-control-lg order_detail_input"
                id="buyerName"
                value={order.name}
                readOnly
              ></input>
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="address"
              className="col-sm-2 col-form-label col-form-label-lg"
            >
              Buyer Address
            </label>
            <div className="col-sm-10">
              <textarea
                className="form-control form-control-lg order_detail_input"
                id="address"
                value={order.address}
                readOnly
              ></textarea>
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="amount"
              className="col-sm-2 col-form-label col-form-label-lg"
            >
              Amount
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control form-control-lg order_detail_input"
                id="amount"
                value={order.amount}
                readOnly
              ></input>
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="status"
              className="col-sm-2 col-form-label col-form-label-lg"
            >
              Status
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control form-control-lg order_detail_input"
                id="status"
                value={order.status}
                readOnly
              ></input>
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="dishes"
              className="col-sm-2 col-form-label col-form-label-lg"
            >
              Dishes
            </label>
          </div>
          <div>
            <BootstrapTable
              keyField="name"
              data={order.dishes}
              columns={columns}
              bordered={true}
              hover
              condensed
              striped
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Orderdetails;
