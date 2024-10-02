import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
import * as AuthService from "../../Services/AuthService.jsx";
import store from "../../store";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../Utils/AxiosUtil.jsx";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [role_id, setRoleId] = useState("66b07827989986d3cc8f438d");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [position, setPosition] = useState("");
  const [institution, setInstitution] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { setStore } = store();

  async function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("role_id", role_id);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("position", position);
    formData.append("institution", institution);
    formData.append("city", city);
    formData.append("country", country);
    if (imageFile) {
      formData.append("image", imageFile); // Add image file to form data
    }

    try {
      const response = await axiosInstance.post(
        "/stressmap/api/v1/users",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;

      if (result.success) {
        await AuthService.init(setStore);
        navigate("/stressmap/login", { replace: true });
      } else {
        setErrorMessage(result.message || "Registration failed");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during registration");
    }
  }

  return (
    <div className="container">
      <Link to="/stressmap/login" className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={onSubmit} className="inputs">
        {/* Form fields */}
        <div className="input">
          <input
            type="text"
            className="form-control"
            placeholder="Role"
            value={role_id}
            onChange={(e) => setRoleId(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <input
            type="text"
            className="form-control"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div className="input">
          <input
            type="text"
            className="form-control"
            placeholder="Institution"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </div>
        <div className="input">
          <input
            type="text"
            className="form-control"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="input">
          <input
            type="text"
            className="form-control"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div className="input">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="input">
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="form-control"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <div className="submit-container">
          <button type="submit" className="btn btn-primary submit">
            Sign Up
          </button>
          <Link to="/stressmap/login" className="btn btn-secondary submit gray">
            Login
          </Link>
        </div>
      </form>
      {/* Styling */}
      <style>
        {`
                    .container {
                        max-width: 400px;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        background-color: #fff;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                        margin-top: 50px;
                    }

                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }

                    .text {
                        font-size: 24px;
                        font-weight: bold;
                    }

                    .underline {
                        width: 50px;
                        height: 3px;
                        background-color: #007bff;
                        margin: 0 auto;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    }

                    .inputs {
                        margin-bottom: 20px;
                    }

                    .input {
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                    }

                    .input input {
                        width: calc(100% - 30px);
                        padding: 10px;
                        border: none;
                        border-bottom: 2px solid #007bff;
                        outline: none;
                        font-size: 16px;
                        color: #333333;
                        background-color: transparent;
                        transition: border-bottom-color 0.3s ease; 
                    }

                    .submit-container {
                        display: flex;
                        justify-content: space-between;
                    }
        `}
      </style>
    </div>
  );
};

export default RegisterPage;
