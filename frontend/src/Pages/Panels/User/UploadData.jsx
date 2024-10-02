import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Layout from './Layout';
import axiosInstance from '../../../Utils/AxiosUtil';

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleFilesUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    }
  };

  const onFileUpload = () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    axiosInstance
      .post("/api/v1/import-csv", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      })
      .then((response) => {
        alert(response.data);
        navigate('/stressmap/maps-user');
      })
      .catch(() => {
        alert("Error uploading file");
        setUploading(false);
      });
  };

  const handleNext = () => {
    if (file && !uploading) {
      onFileUpload();
    }
  };

  const handleHistoryClick = () => {
    navigate('/stressmap/history');
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      position: 'relative', 
      marginRight: '40px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    historyIcon: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      fontSize: '24px',
      color: '#007bff',
      cursor: 'pointer', 
    },
    card: {
      marginBottom: '20px',
      border: 'none',
      fontFamily: "Playfair Display, serif",
      fontWeight: "400",
    },
    cardHeader: {
      backgroundColor: '#fff', 
      border: 'none', 
    },
    cardBody: {
      borderTop: '1px solid #ccc',
      padding: '20px',
    },
    uploadDropZone: {
      position: 'relative',
      maxWidth: '700px',
      border: '2px dashed #007bff',
      borderRadius: '5px',
      padding: '40px',
      textAlign: 'center',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    progress: {
      marginTop: '10px',
    },
    cancelButton: {
      marginRight: '10px',
    },
    icon: {
      fontSize: '48px',
      color: '#007bff',
    },
    footer: {
      marginTop: '10px',
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div className="container" style={styles.container}>
        <i className="bi bi-clock-history" style={styles.historyIcon} onClick={handleHistoryClick}></i>
        <Layout />
        <div className="card" style={styles.card}>
          <div className="card-header" style={styles.cardHeader}>
            <h5 className="card-title">Upload Data</h5>
          </div>
          <div className="card-body" style={styles.cardBody}>
            <div
              className="upload-drop-zone"
              style={styles.uploadDropZone}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <i className="bi bi-folder-symlink" style={styles.icon}></i>
              <p>Drag your file to start uploading</p>
              <p>OR</p>
              <label className="btn btn-primary">
                Browse files
                <input type="file" accept=".csv" onChange={handleFilesUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <p className="text-muted">Only support .csv format</p>
            {file && (
              <ul className="list-group">
                <li className="list-group-item">
                  {file.name} - {file.size} bytes
                  {uploading && (
                    <div className="progress" style={styles.progress}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        {uploadProgress}%
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            )}
          </div>
          <div className="card-footer d-flex justify-content-end" style={styles.footer}>
            <button className="btn btn-secondary" onClick={() => setFile(null)} style={styles.cancelButton}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleNext} disabled={!file || uploading}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadData;
