import { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader"; // Import the ClipLoader
import "./UploadBanner.css";

const UploadBanner = () => {
  const [banner, setBanner] = useState(null);
  const [category, setCategory] = useState("women"); // Default category
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [buttonLoading, setButtonLoading] = useState(false); // Loading state for button actions
  const api = import.meta.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`${api}/banners`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
        alert("Failed to load banners.");
      } finally {
        // Show spinner for 1.2 seconds before stopping loading
        setTimeout(() => {
          setLoading(false);
        }, 1200);
      }
    };

    fetchBanners();
  }, []);

  const handleDelete = async (public_id) => {
    setButtonLoading(true); // Start button loading
    try {
      const response = await fetch(`${api}/delete-banner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id }), // Send the public_id in the request body
      });

      const data = await response.json();
      if (data.success) {
        setBanners((prevBanners) => prevBanners.filter(banner => banner.public_id !== public_id));
        alert(data.message);
      } else {
        alert("Error deleting banner: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Error deleting banner.");
    } finally {
      setButtonLoading(false); // Stop button loading
    }
  };

  const deleteAllBanners = async () => {
    if (window.confirm("Are you sure you want to delete all banners?")) {
      setButtonLoading(true); // Start button loading
      try {
        const response = await fetch(`${api}/delete-all-banners`, {
          method: "DELETE",
        });

        const data = await response.json();
        if (data.success) {
          setBanners([]);
          alert(data.message);
        } else {
          alert("Error deleting all banners: " + data.message);
        }
      } catch (error) {
        console.error("Error deleting all banners:", error);
        alert("Error deleting all banners.");
      } finally {
        setButtonLoading(false); // Stop button loading
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!banner) {
      alert("Please select a banner to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("banner", banner);

    setButtonLoading(true); // Start button loading
    try {
      const uploadResponse = await fetch(`${api}/upload-banner`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload banner.");
      }

      const { banner_url, public_id } = uploadData;

      // Save the banner URL, public ID, and category to the database
      const saveResponse = await fetch(`${api}/add-banner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: banner_url, public_id, category }),
      });

      const saveData = await saveResponse.json();
      if (saveData.success) {
        setBanners((prevBanners) => [...prevBanners, saveData.banner]); // Add new banner to the state
        alert("Banner uploaded successfully!");
      } else {
        alert("Error saving banner: " + saveData.message);
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert("Error uploading banner.");
    } finally {
      setButtonLoading(false); // Stop button loading
    }
  };

  return (
    <div className="add-images" style={{ marginTop: '80px' }}>
      <form onSubmit={handleSubmit}>
        <div className="addproduct-itemfield">
          <label htmlFor="file-input">Upload Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBanner(e.target.files[0])}
            id="file-input"
            required
          />
        </div>
        <div className="addproduct-itemfield">
          <label htmlFor="category">Banner Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            name="category"
            id="category"
            required
            className="add-product-selector"
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <button type="submit" className="addimages-btn" disabled={buttonLoading}>
          {buttonLoading ? <ClipLoader color="#fff" loading={buttonLoading} size={20} /> : "Upload Banner"}
        </button>
      </form>

      <div className="banner-list">
        <h3>Existing Banners</h3>
        {loading ? (
          <div className="spinner-container">
            <ClipLoader color="#000" loading={loading} size={50} />
          </div>
        ) : banners.length > 0 ? (
          <>
            <button onClick={deleteAllBanners} className="delete-all-btn" disabled={buttonLoading}>
              {buttonLoading ? <ClipLoader color="#fff" loading={buttonLoading} size={20} /> : "Delete All Banners"}
            </button>
            {banners.map((banner) => (
              <div key={banner.public_id} className="banner-item">
                <img src={banner.url} alt="Banner" />
                <div>
                  <p>Category: {banner.category}</p>
                  <button onClick={() => handleDelete(banner.public_id)} disabled={buttonLoading}>
                    {buttonLoading ? <ClipLoader color="#fff" loading={buttonLoading} size={20} /> : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No banners to display</p>
        )}
      </div>
    </div>
  );
};

export default UploadBanner;
