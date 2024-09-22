import "./AddImages.css";
import upload_area from "../../assets/upload_area.svg";
import { useState } from "react";

const AddImages = () => {
  const [image, setImage] = useState(null);

  const Add_Hero = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    let responseData;

    // Upload image
    let formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("https://backend-ecommerce-gibj.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Image upload failed");
      }
    } catch (error) {
      alert(error.message);
      return;
    }

    // Prepare hero data with only the image
    const hero = {
      image: responseData.image_url,
    };

    // Post hero data
    try {
      const res = await fetch("https://backend-ecommerce-gibj.onrender.com/addhero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hero),
      });

      const heroResponse = await res.json();
      if (!heroResponse.success) {
        throw new Error("Failed to add hero");
      }

      // Reset the form
      setImage(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="add-images">
      <div className="addimages-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addimages-thumbnail-img"
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
          required
        />
      </div>

      <button onClick={Add_Hero} className="addimages-btn">
        ADD
      </button>
    </div>
  );
};

export default AddImages;
