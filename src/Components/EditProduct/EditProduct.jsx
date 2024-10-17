import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import "./EditProduct.css";

const EditProduct = () => {
  const api = "https://backend-ecommerce-gibj.onrender.com"

  const [images, setImages] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "women",
    new_price: "",
    old_price: "",
    description: "",
    _id: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const { id } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${api}/allproducts`);
        const products = await response.json();
        const product = products.find((p) => p._id === id);

        if (product) {
          setProductDetails({
            name: product.name,
            category: product.category,
            new_price: product.new_price,
            old_price: product.old_price,
            description: product.description,
            _id: product._id,
          });
          setImages(product.images || []);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        showAlert("Failed to fetch product details", "error");
      }
    };

    fetchProductDetails();
  }, [id]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const updateProduct = async () => {
    setIsUpdating(true);
    const formData = new FormData();

    const removeImageIds = images.filter(img => img.shouldRemove).map(img => img.public_id);
    formData.append("removeImageIds", JSON.stringify(removeImageIds));

    Object.keys(productDetails).forEach((key) => {
      formData.append(key, productDetails[key]);
    });

    const fileInput = document.getElementById('file-input');
    if (fileInput.files) {
      for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("newImages", fileInput.files[i]);
      }
    }

    try {
      const response = await fetch(`${api}/editproduct/${productDetails._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        showAlert("Product updated successfully!", "success");
        setProductDetails(data.product);
        setImages(data.product.images);
      } else {
        showAlert("Failed to update product: " + data.message, "error");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      showAlert("An error occurred while updating the product.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const imageHandler = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];
    setIsUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("product", file);

      try {
        const response = await fetch(`${api}/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (data.success) {
          showAlert("Image updated successfully!", "success")
          uploadedImages.push({
            url: data.image_url,
            public_id: data.public_id,
            shouldRemove: false,
          });
        } else {
          showAlert("Failed to upload image: " + data.message, "error");
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
        showAlert("An error occurred while uploading the image.", "error");
      }
    }

    setImages((prevImages) => [...prevImages, ...uploadedImages]);
    setIsUploading(false);
  };

  const removeImage = async (index) => {
    const imageToRemove = images[index];
    try {
      const response = await fetch(`${api}/deleteimage`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id: imageToRemove.public_id }),
      });

      const data = await response.json();
      if (data.success) {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        showAlert("Image removed successfully", "success");
      } else {
        showAlert("Failed to delete image: " + data.message, "error");
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      showAlert("An error occurred while deleting the image.", "error");
    }
  };

  return (
    <div className="edit-product">
      

      <h2 className="form-title">Edit Product</h2>

      <div className="form-group">
        <label htmlFor="name">Product Title</label>
        <input
          id="name"
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Product Description</label>
        <textarea
          id="description"
          value={productDetails.description}
          onChange={changeHandler}
          name="description"
          placeholder="Type here description"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="old_price">Price</label>
          <input
            id="old_price"
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="new_price">Offer Price</label>
          <input
            id="new_price"
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Product Category</label>
        <select
          id="category"
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          required
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="form-group">
        <label>Current Images</label>
        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="image-preview-item">
              <img src={image.url} alt={`Product ${index}`} />
              <button 
                onClick={() => removeImage(index)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <label htmlFor="file-input">Add New Images (Up to {5 - images.length})</label>
        <input
          onChange={imageHandler}
          type="file"
          name="newImages"
          id="file-input"
          multiple
          accept="image/*"
        />
      </div>

      {alert.show && (
        <div className={`alert ${alert.type}`} >
          {alert.message}
        </div>
      )}
      <div className="form-actions">
        {isUploading && <ClipLoader color="#36D7B7" loading={isUploading} size={35} />}
        {isUpdating && <ClipLoader color="#36D7B7" loading={isUpdating} size={35} />}
        {!isUploading && !isUpdating && (
          <button 
            onClick={updateProduct} 
            className="update-btn"
          >
            UPDATE
          </button>
        )}
      </div>
    </div>
  );
};

export default EditProduct;