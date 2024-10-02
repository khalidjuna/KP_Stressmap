import { useState } from 'react';
import axios from 'axios';

const GeoJsonUpload = () => {
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const geojsonData = JSON.parse(e.target.result);

        try {
          const response = await axios.post(`http://localhost:5002/api/v1/geodata`, geojsonData,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('Response:', response.data);
          setShowPopup(true); // Show popup on successful submission
        } catch (error) {
          console.error('Error uploading GeoJSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide popup when OK button is clicked
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".geojson" onChange={handleFileChange} />
        <button type="submit">Upload GeoJSON</button>
      </form>

      {/* Popup for successful submission */}
      {showPopup && (
        <div style={popupStyle}>
          <div style={popupContentStyle}>
            <h3>Success!</h3>
            <p>GeoJSON data uploaded successfully!</p>
            <button onClick={handleClosePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Basic inline styling for the popup
const popupStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  textAlign: 'center',
};

export default GeoJsonUpload;
