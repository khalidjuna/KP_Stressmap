import { useState } from "react";
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);

  const onFileChange = event => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file);

    axios.post("http://localhost:5002/api/import-csv", formData)
      .then(response => alert(response.data))
      .catch(() => alert("Error uploading file"));
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>
        Upload
      </button>
    </div>
  );
}

export default App;
