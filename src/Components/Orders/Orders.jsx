import { useEffect, useState } from "react";
import "./Orders.css";
import ClipLoader from "react-spinners/ClipLoader";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddress, setShowAddress] = useState({});
  const [showPaymentDetails, setShowPaymentDetails] = useState({});
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("active");
  const [color, setColor] = useState("#ff9900");
  const api = "https://backend-ecommerce-gibj.onrender.com";

  const fetchOrders = async () => {
    setError(null);
    try {
      const response = await fetch(`${api}/all-orders`, {
        headers: {
          "auth-token": localStorage.getItem("admin-auth-token"),
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || "Failed to fetch orders");
      }
      const data = await response.json();
      console.log("Orders Fetched Successfully: ✔");
      setOrders(data);
      await verifyPayments(data);
      await fetchUsers(data);
      await fetchProducts();
    } catch (error) {
      setError(error.message);
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (orders) => {
    const userIds = [...new Set(orders.map((order) => order.userId))];
    const userPromises = userIds.map((id) =>
      fetch(`${api}/api/users/${id}`)
        .then((res) => res.json())
        .then((user) => [id, user])
    );
    const userEntries = await Promise.all(userPromises);
    setUsers(Object.fromEntries(userEntries));
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${api}/allproducts`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      const productMap = {};
      data.forEach((product) => {
        productMap[product.id] = product._id;
      });
      setProducts(productMap);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const verifyPayments = async (orders) => {
    const updatedOrders = [...orders];

    for (const order of updatedOrders) {
      if (order.paymentDetails && order.paymentDetails.paymentIntentId) {
        const paymentIntentId = order.paymentDetails.paymentIntentId;
        try {
          const response = await fetch(
            `${api}/verify-payment/${paymentIntentId}`
          );

          if (response.ok) {
            const paymentData = await response.json();
            order.isPaid = paymentData.status === "succeeded";
            order.cardBrand = paymentData.cardBrand;
            order.last4 = paymentData.last4;
            order.expirationMonth = paymentData.expirationMonth;
            order.expirationYear = paymentData.expirationYear;

            if (order.isPaid && order.status === "Pending") {
              order.status = "Processing";
              await handleEdit(order._id, "Processing");
            }
          } else {
            const errorData = await response.json();
            console.error("Error verifying payment:", errorData);
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      }
    }

    setOrders(updatedOrders);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const response = await fetch(`${api}/delete-order/${orderId}`, {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("admin-auth-token"),
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete order");
      }
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all orders?")) return;
    try {
      const response = await fetch(`${api}/delete-all-orders`, {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("admin-auth-token"),
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete all orders");
      }
      setOrders([]);
      alert("All orders deleted successfully.");
    } catch (error) {
      console.error("Error deleting all orders:", error);
    }
  };

  const handleEdit = async (id, deliveryStatus) => {
    try {
      const response = await fetch(`${api}/update-order-status/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("admin-auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: deliveryStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update order status");
      }
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: deliveryStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSort = (e) => {
    setSortType(e.target.value);
  };

  const togglePaymentDetails = (orderId) => {
    setShowPaymentDetails((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getFilteredOrders = () => {
    const searchFiltered = orders.filter(
      (order) =>
        order._id.includes(searchQuery) ||
        (order.userId && order.userId.toLowerCase().includes(searchQuery)) ||
        (users[order.userId] &&
          users[order.userId].name.toLowerCase().includes(searchQuery))
    );

    switch (orderTypeFilter) {
      case "active":
        return searchFiltered.filter(
          (order) =>
            order.status !== "Cancelled" && order.status !== "Delivered"
        );
      case "delivered":
        return searchFiltered.filter((order) => order.status === "Delivered");
      case "Processing":
        return searchFiltered.filter((order) => order.status === "Processing");
      case "cancelled":
        return searchFiltered.filter((order) => order.status === "Cancelled");
      default:
        return searchFiltered;
    }
  };

  const filteredOrders = getFilteredOrders().filter((order) => {
    if (paymentFilter === "paid") return order.isPaid;
    if (paymentFilter === "notPaid") return !order.isPaid;
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortType) {
      case "latest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "cheap":
        return a.totalAmount - b.totalAmount;
      case "expensive":
        return b.totalAmount - a.totalAmount;
      default:
        return 0;
    }
  });

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders Management</h1>

      {isLoading ? (
        <p className="loading-message">
          <ClipLoader
            color={color}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </p>
      ) : (
        <>
          {error && <p className="error-message">{error}</p>}

          <div className="orders-controls">
            <input
              type="text"
              placeholder="Search by order ID, user ID, or user name"
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            <select
              value={sortType}
              onChange={handleSort}
              className="sort-select"
            >
              <option value="latest">Sort by Latest</option>
              <option value="oldest">Sort by Oldest</option>
              <option value="cheap">Sort by Cheapest</option>
              <option value="expensive">Sort by Most Expensive</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="sort-select"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="notPaid">Not Paid</option>
            </select>

            <select
              value={orderTypeFilter}
              onChange={(e) => setOrderTypeFilter(e.target.value)}
              className="order-type-select"
            >
              <option value="active">Active Orders</option>
              <option value="delivered">Delivered Orders</option>
              <option value="Processing">Processed Orders</option>
              <option value="cancelled">Cancelled Orders</option>
            </select>
            <button onClick={handleDeleteAll} className="delete-all-button">
              Delete All Orders
            </button>
          </div>

          {sortedOrders.length === 0 ? (
            <p className="no-orders-message">No orders found.</p>
          ) : (
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Product ID</th>
                    <th>Quantity</th>
                    <th>Size</th>
                    <th>Shipping Address</th>
                    <th>Total</th>
                    <th>Payment Status</th>
                    <th>Delivery Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                    <th>Payment Details</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order) => (
                    <tr
                      key={order._id}
                      className={`status-${order.status.toLowerCase()}`}
                    >
                      <td className="text-truncate">
                        {order._id.substring(0, 8)}
                      </td>
                      <td className="text-truncate">
                        <strong>
                          {users[order.userId]
                            ? users[order.userId].name
                            : "Loading..."}
                        </strong>
                        <br />
                        <small>{order.userId.substring(0, 8)}</small>
                      </td>
                      <td>
                        {order.cartItems && order.cartItems.length > 0
                          ? order.cartItems
                              .map((item) =>
                                products[item.itemId]
                                  ? products[item.itemId].substring(0, 8)
                                  : item.itemId
                                  ? item.itemId.substring(0, 8)
                                  : "N/A"
                              )
                              .join(", ")
                          : "No items"}
                      </td>
                      <td>
                        {order.cartItems
                          .map((item) => item.quantity)
                          .join(", ")}
                      </td>
                      <td>
                        {order.cartItems.map((item) => item.size).join(", ")}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            setShowAddress((prev) => ({
                              ...prev,
                              [order._id]: !prev[order._id],
                            }))
                          }
                        >
                          {showAddress[order._id]
                            ? "Hide Address"
                            : "Show Address"}
                        </button>
                        {showAddress[order._id] && (
                          <div
                            className="address-details"
                            style={{ color: "GrayText" }}
                          >
                            <span style={{ color: "green" }}>Addresse :</span>
                            <p>{order.shippingAddress.street}</p>
                            <p>
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.state},{" "}
                              {order.shippingAddress.zipCode},{" "}
                              {order.shippingAddress.country}, {""}
                              <br></br>
                            </p>

                            <span style={{ color: "green" }}>
                              Billing Contact :
                            </span>
                            <p>
                              {order.billingInfo.phone}
                              <br></br>
                              {order.billingInfo.email}
                              <br></br>
                              {order.billingInfo.name}
                            </p>
                          </div>
                        )}
                      </td>
                      <td>${order.totalAmount}</td>
                      <td
                        className={
                          order.isPaid ? "paid-status" : "unpaid-status"
                        }
                      >
                        {order.isPaid ? "Paid" : "Not Paid"}
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleEdit(order._id, e.target.value)
                          }
                          className={`status-select status-${order.status.toLowerCase()}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => togglePaymentDetails(order._id)}
                          className="payment-details-button"
                        >
                          {showPaymentDetails[order._id]
                            ? "Hide Details"
                            : "Show Details"}
                        </button>
                        {showPaymentDetails[order._id] && (
                          <div className="payment-details">
                            <div className="details-wrapper">
                              {order.isPaid ? (
                                <>
                                  <p>Payment Method: Credit Card</p>
                                  <p>Card Brand: {order.cardBrand}</p>
                                  <p>Last 4: **** {order.last4}</p>
                                  <p>
                                    Exp: {order.expirationMonth}/
                                    {order.expirationYear}
                                  </p>
                                </>
                              ) : (
                                <p>Cash on Delivery</p>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Orders;
