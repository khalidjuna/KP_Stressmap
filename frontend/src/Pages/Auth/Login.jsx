import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import * as AuthService from "../../Services/AuthService.jsx";
import store from "../../store";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const { setStore } = store();
  const navigate = useNavigate(); // Initialize useNavigate

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [setIsLoggedIn] = useState(false);
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);
  const [showLoginSuccessPopup, setShowLoginSuccessPopup] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const result = await AuthService.login({ email, password });
      if (result.success) {
        await AuthService.init(setStore);
        setIsLoggedIn(true);
        setShowLoginSuccessPopup(true);
        // navigate("/stressmap/user/dashboard");
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  }

  const handleForgotPasswordClick = () => {
    setForgotPasswordClicked(true);
  };

  return (
    <div className="container">
      <Link to="/stressmap" className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>

      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="inputs">
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
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="forgot-password" onClick={handleForgotPasswordClick}>
          Forgot Password? <span>Click Here!</span>
        </div>

        {forgotPasswordClicked && (
          <div className="forgot-password-message">
            An email has been sent to your registered email address with instructions to reset your password.
          </div>
        )}

        <div className="submit-container">
          <button type="submit" className="btn btn-primary submit">
            Login
          </button>
          <Link to="/stressmap/register" className="btn btn-secondary submit gray">
            Sign Up
          </Link>
        </div>
      </form>

      {/* Success Pop-up */}
      {showLoginSuccessPopup && (
        <div className="popup-container">
          <div className="popup">
            <h5>Login Success!!</h5>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowLoginSuccessPopup(false);
                navigate("/stressmap/user/dashboard"); 
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <style>{`
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
        }

        .input input {
          width: 100%;
          padding: 10px;
          border: none;
          border-bottom: 2px solid #007bff;
          outline: none;
          font-size: 16px;
          color: #333;
          background-color: transparent;
          transition: border-bottom-color 0.3s ease;
        }

        .error-message {
          color: red;
          text-align: center;
          margin-bottom: 20px;
        }

        .forgot-password {
          text-align: center;
          margin-bottom: 20px;
          cursor: pointer;
        }

        .forgot-password span {
          color: #007bff;
          cursor: pointer;
        }

        .forgot-password-message {
          text-align: center;
          margin-bottom: 20px;
          color: #007bff;
        }

        .submit-container {
          display: flex;
          justify-content: space-between;
        }

        /* Popup styling */
        .popup-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .popup {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
