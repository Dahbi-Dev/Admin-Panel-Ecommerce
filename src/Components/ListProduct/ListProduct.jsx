import { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

const ListProduct = () => {
  const [allproducts, setAllproducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState({});

  // Fetch all products from the server
  const fetchInfo = async () => {
    await fetch("https://backend-ecommerce-gibj.onrender.com/allproducts")
      .then((res) => res.json())
      .then((data) => {
        setAllproducts(data);
        setProductCount(data.length); // Set the total product count
        calculateCategoryCount(data); // Calculate the category-wise count
      });
  };

  // Function to calculate the number of products in each category
  const calculateCategoryCount = (products) => {
    const count = {};
    products.forEach((product) => {
      count[product.category] = (count[product.category] || 0) + 1;
    });
    setCategoryCount(count); // Set category-wise count
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Remove a specific product by id
  const remveProduct = async (id) => {
    await fetch("https://backend-ecommerce-gibj.onrender.com/removeproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        data.success ? alert("Product Deleted") : alert("Failed");
      });
    await fetchInfo();
  };

  // Function to delete all products
  const deleteAllProducts = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete all products? This action cannot be undone!"
    );
    if (confirmation) {
      await fetch(
        "https://backend-ecommerce-gibj.onrender.com/deleteallproducts",
        {
          method: "DELETE",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          data.success
            ? alert("All products deleted")
            : alert("Failed to delete products");
        });
      await fetchInfo(); // Refresh the product list
    }
  };

  return (
    <div className="list-product">
      <h1>All Products</h1>

      {/* Button to delete all products */}
      <button
        className="delete-all-btn"
        style={{
          marginTop: "20px",
          fontSize: "20px",
          border: "1px solid ",
          backgroundColor: "red",
          color: "white",
          borderRadius: "10px",
          cursor: "pointer",
        }}
        onClick={deleteAllProducts}
      >
        Delete All Products
      </button>

      <div className="listproduct-header">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product) => (
          <div key={product.id}>
            <div className="listproduct-format-main listproduct-format">
              <img
                src={product.image}
                alt=""
                className="listproduct-product-icon"
              />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img
                onClick={() => remveProduct(product.id)}
                src={cross_icon}
                className="listproduct-remove-icon"
                alt=""
              />
            </div>
            <hr />
          </div>
        ))}
      </div>

      {/* Display the total number of products */}
      <p>Total Products: <span style={{color:'green'}}>{productCount}</span></p>

      {/* Display the number of products in each category */}

      <ul style={{display:'flex',gap:'15px',listStyle:'none'}}>
        {Object.keys(categoryCount).map((category) => (
          <li key={category}>
            {category}: <span style={{color:'green'}}>{categoryCount[category]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListProduct;
