import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { useState } from "react";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
    description: "", // Added description field
  });

  const changerHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    console.log(productDetails);
    let responseData;

    let product = {
      ...productDetails,
    };

    let formData = new FormData();
    formData.append("product", image);

    // Upload the image
    await fetch("https://backend-ecommerce-gibj.onrender.com/upload", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        responseData = data;
      });

    // If the image upload is successful
    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      // Add product details to the database
      await fetch("https://backend-ecommerce-gibj.onrender.com/addproduct", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
    }

    // Reset the form after submission
    setProductDetails({
      name: "",
      image: "",
      category: "women",
      new_price: "",
      old_price: "",
      description: "", // Reset description
    });
    setImage(null); // Reset image
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changerHandler}
          type="text"
          name="name"
          placeholder="Type here"
          required
        />
        <p>Product Description</p>
        <textarea
          className="texta"
          value={productDetails.description} // Capture description
          onChange={changerHandler}
          name="description"
          placeholder="Type here description"
          required
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changerHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
            required
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changerHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
            required
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changerHandler}
          name="category"
          className="add-product-selector"
          required
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumnail-img"
            alt="Upload Area"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
          accept="image/*" // Accept only image files
        />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
