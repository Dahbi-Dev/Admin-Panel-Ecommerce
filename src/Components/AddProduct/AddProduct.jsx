/* eslint-disable no-unused-vars */
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

const AddProduct = () => {
  const api = "https://backend-ecommerce-gibj.onrender.com"
  const [images, setImages] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "women",
    new_price: "",
    old_price: "",
    description: "",
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const Add_Product = async () => {
    if (images.length === 0) {
      showAlert("Please upload at least one image", "error");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    Object.keys(productDetails).forEach((key) => {
      formData.append(key, productDetails[key]);
    });

    try {
      const response = await fetch(`${api}/addproduct`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        showAlert("Product added successfully", "success");

        // Reset form
        setProductDetails({
          name: "",
          category: "women",
          new_price: "",
          old_price: "",
          description: "",
        });
        setImages([]);
      } else {
        showAlert("Failed to add product", "error");
      }
    } catch (error) {
      showAlert("An error occurred while adding the product", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const imageHandler = (e) => {
    const newImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="add-product" style={{ marginTop: "80px" }}>
      <div className="addproduct-itemfield">
        <h1 style={{textAlign:'center'}}>Product title</h1>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
          required
        />
        <p>Product Description</p>
        <textarea
          className="texta"
          value={productDetails.description}
          onChange={changeHandler}
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
            onChange={changeHandler}
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
            onChange={changeHandler}
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
          onChange={changeHandler}
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
        <p>Product Images (Up to 5)</p>
        <input
          onChange={imageHandler}
          type="file"
          name="images"
          id="file-input"
          multiple
          accept="image/*"
        />
        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="image-preview-item">
              <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
              <button onClick={() => removeImage(index)}>Remove</button>
            </div>
          ))}
        </div>

        {alert.show && (
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        )}
      </div>
      <button
        onClick={Add_Product}
        className="addproduct-btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <ClipLoader color="#ffffff" loading={isLoading} size={20} />
        ) : (
          "ADD"
        )}
      </button>
    </div>
  );
};

export default AddProduct;
