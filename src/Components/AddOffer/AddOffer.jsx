import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners'; // Import the spinner
import './AddOffer.css';

// Base URL for API

const AddOffer = () => {

    const api = import.meta.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({
        headline1: '',
        headline2: '',
        paragraph: '',
        buttonText: '',
        buttonColor: '',
        backgroundColor: '',
        backgroundColor2: '',
        image: null,
    });

    const [offerId, setOfferId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
    const [initialLoading, setInitialLoading] = useState(true); // State to track initial loading

    useEffect(() => {
        fetchOffers(); // Fetch all offers on component mount
    }, []);

    useEffect(() => {
        if (offerId) {
            // Fetch offer details for editing
            setLoading(true); // Start loading for offer details
            fetch(`${api}/offer/${offerId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.offer) {
                        setFormData({
                            headline1: data.offer.headline_1,
                            headline2: data.offer.headline_2,
                            paragraph: data.offer.paragraph,
                            buttonText: data.offer.button_text,
                            buttonColor: data.offer.button_color,
                            backgroundColor: data.offer.background_color_1,
                            backgroundColor2: data.offer.background_color_2,
                            image: null,
                        });
                        setImagePreview(data.offer.image_url || '');
                    } else {
                        setError(data.message || 'Failed to fetch offer details.');
                    }
                })
                .catch(err => {
                    console.error('Error fetching offer:', err);
                    setError('Failed to fetch offer details.');
                })
                .finally(() => {
                    setLoading(false); // Stop loading for offer details
                });
        }
    }, [offerId]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({ ...prevData, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true); // Start loading

        const formDataToSubmit = new FormData();

        // Append each field to formDataToSubmit
        if (formData.headline1) formDataToSubmit.append('headline_1', formData.headline1);
        if (formData.headline2) formDataToSubmit.append('headline_2', formData.headline2);
        if (formData.paragraph) formDataToSubmit.append('paragraph', formData.paragraph);
        if (formData.buttonText) formDataToSubmit.append('button_text', formData.buttonText);
        if (formData.buttonColor) formDataToSubmit.append('button_color', formData.buttonColor);
        
        // Append background colors separately
        if (formData.backgroundColor) formDataToSubmit.append('background_color_1', formData.backgroundColor);
        if (formData.backgroundColor2) formDataToSubmit.append('background_color_2', formData.backgroundColor2);

        if (formData.image) {
            formDataToSubmit.append('image', formData.image);
        }

        const endpoint = offerId ? `${api}/update-offer/${offerId}` : `${api}/upload-offer`;

        try {
            const response = await fetch(endpoint, {
                method: offerId ? 'PATCH' : 'POST',
                body: formDataToSubmit,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update the offer.');
                return;
            }

            const data = await response.json();
            if (!data.success) {
                setError(data.message);
            } else {
                setSuccess(data.message);
                resetForm();
                fetchOffers(); // Re-fetch offers after adding/updating
            }
        } catch (error) {
            setError('An error occurred while submitting the offer.');
            console.error("Error submitting offer:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const resetForm = () => {
        setFormData({
            headline1: '',
            headline2: '',
            paragraph: '',
            buttonText: '',
            buttonColor: '',
            backgroundColor: '',
            backgroundColor2: '',
            image: null,
        });
        setImagePreview('');
        setOfferId(null); // Reset offerId for new entry
    };

    const fetchOffers = async () => {
        setInitialLoading(true); // Start initial loading
        try {
            const res = await fetch(`${api}/offers`);
            const data = await res.json();
            setOffers(data);
        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setInitialLoading(false); // Stop initial loading
        }
    };

    const deleteOffer = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                const res = await fetch(`${api}/offer/${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    fetchOffers();
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error deleting offer:', error);
            }
        }
    };

    const deleteAllOffers = async () => {
        if (window.confirm('Are you sure you want to delete all offers?')) {
            try {
                const res = await fetch(`${api}/offers`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    fetchOffers();
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error deleting all offers:', error);
            }
        }
    };

    return (
        <div className="add-offer" style={{ marginTop: '80px' }}>
            <h2>{offerId ? 'Edit Offer' : 'Add Offer'}</h2>

            {initialLoading ? (
                <ClipLoader color="#000" loading={initialLoading} size={50} />
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Headline 1:</label>
                        <input
                            type="text"
                            name="headline1"
                            value={formData.headline1}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Headline 2:</label>
                        <input
                            type="text"
                            name="headline2"
                            value={formData.headline2}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Paragraph:</label>
                        <textarea
                            name="paragraph"
                            value={formData.paragraph}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Button Text:</label>
                        <input
                            type="text"
                            name="buttonText"
                            value={formData.buttonText}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Button Color:</label>
                        <input
                            type="color"
                            name="buttonColor"
                            value={formData.buttonColor}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Background Color 1:</label>
                        <input
                            type="color"
                            name="backgroundColor"
                            value={formData.backgroundColor}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Background Color 2:</label>
                        <input
                            type="color"
                            name="backgroundColor2"
                            value={formData.backgroundColor2}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && <img src={imagePreview} alt="Preview" width="100" />}
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? <ClipLoader color="#fff" loading={loading} size={20} /> : 'Submit'}
                    </button>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                </form>
            )}

            {loading && <ClipLoader color="#000" loading={loading} size={50} />}
            <h3>Offers List:</h3>
            <ul>
                {offers.map(offer => (
                    <li key={offer.id}>
                        {offer.headline_1} - {offer.headline_2}
                        <button onClick={() => { setOfferId(offer.id); resetForm(); }}>Edit</button>
                        <button onClick={() => deleteOffer(offer.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={deleteAllOffers}>Delete All Offers</button>
        </div>
    );
};

export default AddOffer;
