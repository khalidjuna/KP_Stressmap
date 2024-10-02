import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DownloadPopup = ({ onClose, selectedArea }) => {
  const [realData, setRealData] = useState(null);
  const [interpolatedData, setInterpolatedData] = useState(null);
  const [selectedDataType, setSelectedDataType] = useState('real');
  const [selectedFormat, setSelectedFormat] = useState('png');

  useEffect(() => {
    const fetchRealData = async () => {
      const data = await new Promise(resolve => {
        setTimeout(() => resolve({ temperature: 25, humidity: 80 }), 1000);
      });
      setRealData(data);
    };

    const calculateInterpolatedData = () => {
      if (realData) {
        const interpolated = {
          temperature: realData.temperature + 2,
          humidity: realData.humidity - 10,
        };
        setInterpolatedData(interpolated);
      }
    };

    fetchRealData();
    if (realData) {
      calculateInterpolatedData();
    }
  }, [realData]);

  const handleDownload = () => {
    const dataToDownload = selectedDataType === 'real' ? realData : interpolatedData;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 200;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.fillText(`Area: ${selectedArea}`, 10, 30);
    ctx.fillText(`Temperature: ${dataToDownload.temperature}`, 10, 60);
    ctx.fillText(`Humidity: ${dataToDownload.humidity}`, 10, 90);

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data.${selectedFormat}`;
      a.click();
      URL.revokeObjectURL(url);
    }, `image/${selectedFormat}`);
  };

  const styles = {
    popupContainer: {
      position: 'fixed',
      top: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      width: '350px',
      textAlign: 'center',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      marginBottom: '20px',
      fontSize: '1.5rem',
      color: '#333',
      fontWeight: 'bold',
    },
    radioContainer: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
    },
    radioLabel: {
      marginLeft: '5px',
      fontSize: '1rem',
      color: '#555',
    },
    areaContainer: {
      marginTop: '20px',
      textAlign: 'left',
    },
    areaLabel: {
      fontWeight: 'bold',
      color: '#333',
    },
    areaText: {
      margin: '4px 0',
      color: '#555',
    },
    button: {
      marginTop: '20px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '4px',
      outline: 'none',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    downloadButton: {
      marginTop: '10px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: '#28a745',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '4px',
      outline: 'none',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease',
    },
    downloadButtonHover: {
      backgroundColor: '#218838',
    },
    loadingText: {
      color: '#555',
      fontSize: '1rem',
    },
    dropdown: {
      marginTop: '20px',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      color: '#555',
      width: '100%',
    },
  };

  return (
    <div style={styles.popupContainer}>
      <h3 style={styles.title}>Download File</h3>
      {realData ? (
        <>
          <div style={styles.radioContainer}>
            <div>
              <input
                type="radio"
                id="real"
                name="dataType"
                value="real"
                checked={selectedDataType === 'real'}
                onChange={() => setSelectedDataType('real')}
              />
              <label htmlFor="real" style={styles.radioLabel}>Real Data</label>
            </div>
            <div>
              <input
                type="radio"
                id="interpolated"
                name="dataType"
                value="interpolated"
                checked={selectedDataType === 'interpolated'}
                onChange={() => setSelectedDataType('interpolated')}
              />
              <label htmlFor="interpolated" style={styles.radioLabel}>Interpolated Data</label>
            </div>
          </div>
          <div style={styles.areaContainer}>
            <label htmlFor="area" style={styles.areaLabel}>Selected Area:</label>
            <p style={styles.areaText}>{selectedArea}</p>
          </div>
          <div>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              style={styles.dropdown}
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="gif">GIF</option>
            </select>
          </div>
          <button
            onClick={onClose}
            style={styles.button}
            onMouseEnter={e => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseLeave={e => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Close
          </button>
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={handleDownload}
              style={styles.downloadButton}
              onMouseEnter={e => (e.target.style.backgroundColor = styles.downloadButtonHover.backgroundColor)}
              onMouseLeave={e => (e.target.style.backgroundColor = styles.downloadButton.backgroundColor)}
            >
              Download as {selectedFormat.toUpperCase()}
            </button>
          </div>
        </>
      ) : (
        <p style={styles.loadingText}>Loading data...</p>
      )}
    </div>
  );
};
DownloadPopup.propTypes = {
  onClose: PropTypes.func.isRequired, // Menambahkan validasi prop untuk onClose
  selectedArea: PropTypes.array.isRequired, // Tambahkan ini juga jika diperlukan
};

export default DownloadPopup;
