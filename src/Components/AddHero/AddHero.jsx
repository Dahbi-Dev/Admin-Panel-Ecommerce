// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader"; // Import the ClipLoader
import "./AddHero.css";

function AddHero() {
  const [formData, setFormData] = useState({
    smallTitle: "",
    bigTitle: "",
    backgroundColor: "",
    secondColor: "",
    buttonText: "",
    buttonColor: "",
    iconImage1: null,
    iconImage2: null,
    heroImage: null,
  });

  const [heroId, setHeroId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [existingHeroImages, setExistingHeroImages] = useState({});
  const api = "https://backend-ecommerce-gibj.onrender.com"


  const fetchHeroData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/hero`);
      if (!response.ok) throw new Error("Failed to fetch hero data");
      const data = await response.json();

      if (data && data._id) {
        setFormData({
          smallTitle: data.small_title,
          bigTitle: data.big_title,
          backgroundColor: data.background_color,
          secondColor: data.second_color,
          buttonText: data.button_text,
          buttonColor: data.button_color,
          iconImage1: null,
          iconImage2: null,
          heroImage: null,
        });
        setHeroId(data._id);
        setExistingHeroImages({
          heroImage: data.image_url,
          iconImage1: data.icon_image_1,
          iconImage2: data.icon_image_2,
        });
      } else {
        resetFormData();
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
      setErrorMessage("Error fetching hero data");
    } finally {
      // Show spinner for 1.2 seconds before setting loading to false
      setTimeout(() => {
        setLoading(false);
      }, 1200);
    }
  };
  useEffect(() => {
    fetchHeroData();
  }, []);

  const resetFormData = () => {
    setFormData({
      smallTitle: "",
      bigTitle: "",
      backgroundColor: "",
      secondColor: "",
      buttonText: "",
      buttonColor: "",
      iconImage1: null,
      iconImage2: null,
      heroImage: null,
    });
    setHeroId(null);
    setExistingHeroImages({});
  };

 

  const handleChange = (e) => {
    const { name, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    if (formData.heroImage) {
      data.append("hero_image", formData.heroImage);
    }
    if (formData.iconImage1) {
      data.append("icon_image_1", formData.iconImage1);
    }
    if (formData.iconImage2) {
      data.append("icon_image_2", formData.iconImage2);
    }
    data.append("small_title", formData.smallTitle);
    data.append("big_title", formData.bigTitle);
    data.append("button_text", formData.buttonText);
    data.append("button_color", formData.buttonColor);
    data.append("background_color", formData.backgroundColor);
    data.append("second_color", formData.secondColor);

    try {
      const method = heroId ? "PATCH" : "POST";
      const url = heroId
        ? `http://localhost:4000/update-hero/${heroId}`
        : "http://localhost:4000/upload-hero";

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        setSuccessMessage(
          `Hero section ${heroId ? "updated" : "created"} successfully!`
        );
        resetFormData();
        fetchHeroData();
      } else {
        const errorData = await response.json();
        throw new Error(
          `Failed to ${heroId ? "update" : "create"} hero section: ${errorData.message}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    }
  };

  const handleDelete = async () => {
    if (
      heroId &&
      window.confirm("Are you sure you want to delete this hero section?")
    ) {
      try {
        const response = await fetch(`http://localhost:4000/hero`);
        const heroData = await response.json();

        if (!heroData) {
          alert("No hero section found to delete");
          return;
        }

        const publicId = heroData.public_id;

        const deleteResponse = await fetch(
          `http://localhost:4000/delete-hero`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ public_id: publicId }),
          }
        );

        if (deleteResponse.ok) {
          alert("Hero section deleted successfully!");
          resetFormData();
        } else {
          alert("Failed to delete hero section");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="add-hero-container" style={{ marginTop: '80px' }}>
      <h2>{heroId ? "Edit Hero Section" : "Create a New Hero Section"}</h2>
      {loading ? (
        <div className="spinner-container">
          <ClipLoader color="#000" loading={loading} size={50} />
        </div>
      ) : (
        <>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          <form onSubmit={handleSubmit}>
            <label>
              Small Title:
              <input
                type="text"
                name="smallTitle"
                value={formData.smallTitle}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Big Title:
              <input
                type="text"
                name="bigTitle"
                value={formData.bigTitle}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Hero Image:
              <input
                type="file"
                name="heroImage"
                accept="image/*"
                onChange={handleChange}
              />
              {existingHeroImages.heroImage && (
                <img
                  src={existingHeroImages.heroImage}
                  alt="Hero"
                  style={{ width: "50px", height: "auto" }}
                />
              )}
            </label>

            <label>
              Background Color:
              <input
                type="color"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Second Color:
              <input
                type="color"
                name="secondColor"
                value={formData.secondColor}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Button Text:
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Button Color:
              <input
                type="color"
                name="buttonColor"
                value={formData.buttonColor}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Icon Image 1:
              <input
                type="file"
                name="iconImage1"
                accept="image/*"
                onChange={handleChange}
              />
              {existingHeroImages.iconImage1 && (
                <img
                  src={existingHeroImages.iconImage1}
                  alt="Icon 1"
                  style={{ width: "50px", height: "auto" }}
                />
              )}
            </label>

            <label>
              Icon Image 2:
              <input
                type="file"
                name="iconImage2"
                accept="image/*"
                onChange={handleChange}
              />
              {existingHeroImages.iconImage2 && (
                <img
                  src={existingHeroImages.iconImage2}
                  alt="Icon 2"
                  style={{ width: "50px", height: "auto" }}
                />
              )}
            </label>

            <button type="submit">
              {heroId ? "Update Hero Section" : "Create Hero Section"}
            </button>
          </form>

          {heroId && (
            <button
              onClick={handleDelete}
              style={{
                marginTop: "20px",
                backgroundColor: "#dc3545",
                color: "#fff",
              }}
            >
              Delete Hero Section
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default AddHero;
