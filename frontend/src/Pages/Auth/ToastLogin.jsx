import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import * as AuthService from "../../Services/AuthService.jsx";
import store from "../../store";
import "bootstrap/dist/css/bootstrap.min.css";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Toast CSS

const LoginPage = () => {
  const navigate = useNavigate();
  const { setStore } = store();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); // Aktifkan spinner
    try {
      const result = await AuthService.login({ email, password });
      if (result.success) {
        await AuthService.init(setStore);
        setIsLoggedIn(true);
        setLoading(false); // Matikan spinner
        toast.success("Login Berhasil!");

        // Redirect setelah beberapa detik
        setTimeout(() => {
          navigate("/stressmap/maps-user", { replace: true });
        }, 3000);
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
        setLoading(false); // Matikan spinner
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      setLoading(false); // Matikan spinner
    }
  }

  const handleForgotPasswordClick = () => {
    setForgotPasswordClicked(true);
  };

  const handleLogout = () => {
    AuthService.logout(); // Pastikan untuk mengimplementasikan metode logout di AuthService
    setIsLoggedIn(false);
  };

  return (
    <div className="container">
      {isLoggedIn && (
        <button className="btn btn-danger logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
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
            />
          </div>
          <div className="input">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="forgot-password" onClick={handleForgotPasswordClick}>
          Forgot Password? <span>Click Here!</span>
        </div>
        {forgotPasswordClicked && (
          <div className="forgot-password-message">
            An email has been sent to your registered email address with
            instructions to reset your password.
          </div>
        )}

        <div className="submit-container">
          {loading ? (
            <div className="spinner-container">
              <ClipLoader size={35} color={"#007bff"} loading={loading} />
            </div>
          ) : (
            <>
              <button type="submit" className="btn btn-primary submit">
                Login
              </button>
              <Link
                to="/stressmap/register"
                className="btn btn-secondary submit gray"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
