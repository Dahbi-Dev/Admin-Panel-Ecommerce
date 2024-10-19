import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners"; // Import the spinner component
import "./AddFooter.css";

function AddFooter() {
  const [text, setText] = useState("");
  const [textUrl, setTextUrl] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconUrl, setIconUrl] = useState("");
  const [loadingPage, setLoadingPage] = useState(true); // State to track overall page loading
  const [loadingText, setLoadingText] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [footerTextItems, setFooterTextItems] = useState([]);
  const [footerIconItems, setFooterIconItems] = useState([]);
  const api = import.meta.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFooterItems();
  }, [api]);
  const fetchFooterItems = async () => {
    try {
      const textResponse = await fetch(`${api}/footer-texts`);
      if (!textResponse.ok) throw new Error("Failed to load footer text items");
      const textData = await textResponse.json();
      setFooterTextItems(textData);

      const iconResponse = await fetch(`${api}/footer-icons`);
      if (!iconResponse.ok) throw new Error("Failed to load footer icon items");
      const iconData = await iconResponse.json();
      setFooterIconItems(iconData);
    } catch (error) {
      console.error("Error fetching footer items:", error);
      setError("Failed to load footer items");
    } finally {
      setLoadingPage(false); // Once data is fetched, stop loading spinner
    }
  };

  const handleIconChange = (event) => {
    setIcon(event.target.files[0]);
  };

  const handleTextSubmit = async (event) => {
    event.preventDefault();
    setLoadingText(true);
    setError("");
    setSuccessMessage("");

    if (!text || !textUrl) {
      setError("Please fill in both text fields.");
      setLoadingText(false);
      return;
    }

    try {
      const response = await fetch(`${api}/upload-footer-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, textUrl }),
      });

      if (!response.ok) throw new Error("Failed to upload footer text item");
      const data = await response.json();
      setSuccessMessage(data.message); // Display success message
      fetchFooterItems();
      resetTextForm();
    } catch (error) {
      console.error("Error uploading footer text item:", error);
      setError(error.message);
    } finally {
      setLoadingText(false);
    }
  };

  const handleIconSubmit = async (event) => {
    event.preventDefault();
    setLoadingIcon(true);
    setError("");
    setSuccessMessage("");

    if (!icon) {
      setError("Please upload an icon image.");
      setLoadingIcon(false);
      return;
    }

    const formData = new FormData();
    formData.append("icon", icon);
    formData.append("iconUrl", iconUrl);

    try {
      const response = await fetch(`${api}/upload-footer-icon`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload footer icon item");
      const data = await response.json();
      setSuccessMessage(data.message); // Display success message
      fetchFooterItems();
      resetIconForm();
    } catch (error) {
      console.error("Error uploading footer icon item:", error);
      setError(error.message);
    } finally {
      setLoadingIcon(false);
    }
  };

  const resetTextForm = () => {
    setText("");
    setTextUrl("");
  };

  const resetIconForm = () => {
    setIcon(null);
    setIconUrl("");
  };

  const handleDeleteTextItem = async (id) => {
    try {
      const response = await fetch(`${api}/footer-text/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage(data.message); // Display success message
        fetchFooterItems();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error deleting footer text item:", error);
      setError(error.message);
    }
  };

  const handleDeleteIconItem = async (id) => {
    try {
      const response = await fetch(`${api}/footer-icon/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage(data.message); // Display success message
        fetchFooterItems();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error deleting footer icon item:", error);
      setError(error.message);
    }
  };

  return (
    <div className="add-footer" style={{ marginTop: "80px" }}>
      {/* Show spinner while loading the page */}
      {loadingPage ? (
        <div className="spinner-container">
          <ClipLoader color="#123abc" loading={true} size={50} />
        </div>
      ) : (
        <>
          <h2>Add Footer Text Item</h2>
          {error && <p className="alert alert-error">{error}</p>}
          {successMessage && (
            <p className="alert alert-success">{successMessage}</p>
          )}

          <form onSubmit={handleTextSubmit}>
            <div className="form-group">
              <label htmlFor="text">Text:</label>
              <input
                type="text"
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="textUrl">Text URL:</label>
              <input
                type="text"
                id="textUrl"
                value={textUrl}
                onChange={(e) => setTextUrl(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loadingText}>
              {loadingText ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                "Add Footer Text Item"
              )}
            </button>
          </form>

          <h2>Add Footer Icon Item</h2>
          <form onSubmit={handleIconSubmit}>
            <div className="form-group">
              <label htmlFor="icon">Icon Image:</label>
              <input
                type="file"
                id="icon"
                accept="image/*"
                onChange={handleIconChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="iconUrl">Icon URL:</label>
              <input
                type="text"
                id="iconUrl"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loadingIcon}>
              {loadingIcon ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                "Add Footer Icon Item"
              )}
            </button>
          </form>

          <h3>Footer Text Items</h3>
          <div className="footer-items">
            {footerTextItems.map((item) => (
              <div key={item._id} className="footer-item card">
                <div className="footer-item-content">
                  <p>{item.text}</p>
                  <a
                    href={item.textUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.textUrl}
                  </a>
                  <button onClick={() => handleDeleteTextItem(item._id)}>
                    Delete Item
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3>Footer Icon Items</h3>
          <div className="footer-items">
            {footerIconItems.length > 0 ? (
              footerIconItems.map((item) => (
                <div key={item._id} className="footer-item icon-card">
                  <div className="footer-item-content">
                    <img
                      src={item.iconImageUrl}
                      alt={`Icon for ${item.iconUrl}`}
                      className="footer-icon"
                    />
                    <a
                      href={item.iconUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.iconUrl}
                    </a>
                    <button onClick={() => handleDeleteIconItem(item._id)}>
                      Delete Icon
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No footer icon items available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AddFooter;
