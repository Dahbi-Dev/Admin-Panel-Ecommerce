import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./ListProduct.css";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("oldest");
  const [categorySortOption, setCategorySortOption] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const api = "https://backend-ecommerce-gibj.onrender.com"
  

  const fetchInfo = async () => {
    const res = await fetch(`${api}/allproducts`);
    const data = await res.json();
    setAllProducts(data);
    setProductCount(data.length);
    calculateCategoryCount(data);
  };

  const calculateCategoryCount = (products) => {
    const count = {};
    products.forEach((product) => {
      count[product.category] = (count[product.category] || 0) + 1;
    });
    setCategoryCount(count);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    await fetch(`${api}/removeproduct`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    fetchInfo();
  };

  const deleteAllProducts = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete all products? This action cannot be undone!"
    );
    if (confirmation) {
      setIsDeleting(true);
      try {
        const response = await fetch(
          `${api}/deleteallproducts`,
          {
            method: "DELETE",
          }
        );
        const data = await response.json();
        if (data.success) {
          alert(data.message);
          fetchInfo();
        } else {
          alert("Failed to delete all products. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting all products:", error);
        alert("An error occurred while deleting products. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const sortProducts = (products) => {
    const sortedProducts = [...products];
    switch (sortOption) {
      case "latest":
        return sortedProducts.sort((a, b) => b.id - a.id);
      case "oldest":
        return sortedProducts.sort((a, b) => a.id - b.id);
      case "cheap":
        return sortedProducts.sort((a, b) => a.new_price - b.new_price);
      case "expensive":
        return sortedProducts.sort((a, b) => b.new_price - a.new_price);
      default:
        return sortedProducts;
    }
  };

  const filterByCategory = (products) => {
    if (categorySortOption === "all") return products;
    return products.filter(
      (product) => product.category === categorySortOption
    );
  };

  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toString().includes(searchTerm) ||
      product.id.toString().includes(searchTerm)
  );

  const sortedAndFilteredProducts = filterByCategory(
    sortProducts(filteredProducts)
  );

  return (
    <div className="list-product" style={{ marginTop: "80px" }}>
      <h1>All Products</h1>
      <div className="orders-controls">
        <input
          type="text"
          placeholder="Search by title or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-button"
        >
          <option value="latest">Latest Added</option>
          <option value="oldest">Oldest</option>
          <option value="cheap">Cheapest</option>
          <option value="expensive">Most Expensive</option>
        </select>
        <select
          value={categorySortOption}
          onChange={(e) => setCategorySortOption(e.target.value)}
          className="sort-button"
        >
          <option value="all">All Categories</option>
          {Object.keys(categoryCount).map((category) => (
            <option key={category} value={category}>
              {category} ({categoryCount[category]})
            </option>
          ))}
        </select>
      </div>

      <button
        className="delete-all-btn"
        onClick={deleteAllProducts}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ClipLoader color="#ffffff" loading={isDeleting} size={20} />
        ) : (
          "Delete All Products"
        )}
      </button>

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Old Price</th>
            <th>New Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.id}</td>
              <td>
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                ) : (
                  <p>No Image</p>
                )}
              </td>
              <td>{product.name}</td>
              <td>${product.old_price}</td>
              <td>${product.new_price}</td>
              <td>{product.category}</td>
              <td>
                <div className="action-icons">
                  <FaTrash
                    onClick={() => removeProduct(product._id)}
                    style={{ color: "red" }}
                  />
                  <Link to={`/editproduct/${product._id}`}>
                    <FaEdit style={{ color: "blue" }} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="product-count">
        Total Products: <span>{sortedAndFilteredProducts.length}</span>
      </p>
    </div>
  );
};

export default ListProduct;
