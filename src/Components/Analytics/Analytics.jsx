/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Package, ListOrdered, Users, ClipboardList, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import UserGraph from "./UserGraph";
import OrderGraph from "./OrderGraph";
import ProductGraph from "./ProductGraph";
import FinanceGraph from "./FinanceGraph";

const Analytics = () => {
  const api = import.meta.env.VITE_API_URL;

  const [data, setData] = useState({
    productsCount: 0,
    categoriesCount: 0,
    usersCount: 0,
    ordersCount: 0,
    totalBalance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, usersResponse, ordersResponse, financeResponse] =
          await Promise.all([
            fetch(`${api}/allproducts`),
            fetch(`${api}/api/users`),
            fetch(`${api}/all-orders`),
            fetch(`${api}/api/finance-data?timeFrame=lastYear`),
          ]);

        const productsData = await productsResponse.json();
        const usersData = await usersResponse.json();
        const ordersData = await ordersResponse.json();
        const financeData = await financeResponse.json();

        const categories = [
          ...new Set(
            productsData.map((product) => product.category).filter(Boolean)
          ),
        ];

        // Calculate total balance only for delivered orders
        const deliveredOrdersBalance = ordersData
          .filter(order => order.status === "Delivered")
          .reduce((total, order) => total + order.totalAmount, 0);

        setData({
          productsCount: productsData.length,
          categoriesCount: categories.length,
          usersCount: usersData.length,
          ordersCount: ordersData.length,
          totalBalance: deliveredOrdersBalance,
        });
      } catch (err) {
        setError(err.message);
        setData({
          productsCount: 156,
          categoriesCount: 12,
          usersCount: 1284,
          ordersCount: 879,
          totalBalance: 50000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: data.productsCount,
      Icon: Package,
      color: "#3b82f6",
      link: "/listproduct",
    },
    {
      title: "Total Categories",
      value: data.categoriesCount,
      Icon: ListOrdered,
      color: "#22c55e",
    },
    {
      title: "Total Users",
      value: data.usersCount,
      Icon: Users,
      color: "#a855f7",
      link: "/listusers",
    },
    {
      title: "Total Orders",
      value: data.ordersCount,
      Icon: ClipboardList,
      color: "#f97316",
      link: "/orders",
    },
    {
      title: "Total Balance (Delivered Orders)",
      value: `$${data.totalBalance.toFixed(2)}`,
      Icon: DollarSign,
      color: "#10b981",
      link: "/finance",
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          color: "#1f2937",
        }}
      >
        Analytics Dashboard
      </h1>

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            borderRadius: "4px",
          }}
        >
          Error loading data. Using fallback values. Or Check your Internet Connection
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
        }}
      >
        {cards.map(({ title, value, Icon, color, link }) => (
          <Link to={link} key={title} style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h2
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    fontWeight: "500",
                  }}
                >
                  {title}
                </h2>
                <Icon size={20} color={color} />
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                }}
              >
                {value}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: "40px" }}>
        <UserGraph />
      </div>
      <div style={{ marginTop: "40px" }}>
        <OrderGraph />
      </div>
      <div style={{ marginTop: "40px" }}>
        <ProductGraph />
      </div>
      <div style={{ marginTop: "40px" }}>
        <FinanceGraph />
      </div>
    </div>
  );
};

export default Analytics;