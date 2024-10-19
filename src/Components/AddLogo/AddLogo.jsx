import { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader"; // Import the ClipLoader
import "./AddLogo.css"; // Import your CSS styles here

const AddLogo = () => {
  const [logo, setLogo] = useState(null);
  const [logoName, setLogoName] = useState(""); // State for logo name
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const api = import.meta.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchLogos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/logos`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLogos(data);
      } catch (error) {
        console.error("Error fetching logos:", error);
        alert("Failed to load logos.");
      } finally {
        // Show spinner for 1.2 seconds before setting loading to false
        setTimeout(() => {
          setLoading(false);
        }, 1200);
      }
    };

    fetchLogos();
  }, []);

  const handleDelete = async (public_id) => {
    const prevLogos = logos;
    setLogos((prev) => prev.filter((logo) => logo.public_id !== public_id));

    try {
      const response = await fetch(`${api}/delete-logo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id }),
      });

      const data = await response.json();
      if (!data.success) {
        alert("Error deleting logo: " + data.message);
        setLogos(prevLogos); // Revert to previous logos if deletion fails
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting logo:", error);
      alert("Error deleting logo.");
      setLogos(prevLogos); // Revert to previous logos if an error occurs
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logo || !logoName) {
      alert("Please select a logo and provide a name.");
      return;
    }

    setUploading(true);

    // Check if a logo already exists
    if (logos.length > 0) {
      alert("A logo already exists. Delete the existing logo first.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("logo", logo);
    formData.append("name", logoName); // Append the logo name

    try {
      const uploadResponse = await fetch(`${api}/upload-logo`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload logo.");
      }

      const uploadData = await uploadResponse.json();

      if (!uploadData.logo_url || !uploadData.public_id || !uploadData.name) {
        throw new Error("Invalid response data.");
      }

      // Update the logos state with the new logo data
      setLogos((prevLogos) => [
        ...prevLogos,
        { url: uploadData.logo_url, public_id: uploadData.public_id, name: uploadData.name },
      ]);
      alert("Logo uploaded successfully!");
      setLogo(null);
      setLogoName(""); // Reset the logo name
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Error uploading logo: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-images" style={{ marginTop: "80px" }}>
      <form onSubmit={handleSubmit}>
        <div className="addproduct-itemfield">
          <label htmlFor="file-input">Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            id="file-input"
            required
          />
        </div>
        <div className="addproduct-itemfield">
          <label htmlFor="logo-name">Logo Name</label>
          <input
            type="text"
            id="logo-name"
            value={logoName}
            onChange={(e) => setLogoName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="addimages-btn" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Logo"}
        </button>
      </form>
      <h2>Logos</h2>
      {loading ? (
        <div className="spinner-container">
          <ClipLoader color="#000" loading={loading} size={50} />
        </div>
      ) : logos.length === 0 ? (
        <p>No logos available.</p>
      ) : (
        <div className="logos">
          {logos.map((logo) => (
            <div key={logo.public_id} className="logo-item">
              <img src={logo.url} alt={logo.name} />
              <div>
                <p>{logo.name}</p>
                <button onClick={() => handleDelete(logo.public_id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddLogo;
