import { useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import logo from "../images/app-logo.svg";
import useCheckAuthorized from '../CheckAuthorized';
import Swal from 'sweetalert2'; // Import SweetAlert2
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_NAME } from "../constants";
import Spinner from 'react-bootstrap/Spinner';

const Register = () => {
  const isAuthorized = useCheckAuthorized();  // Use the custom hook
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Password does not match',
      });
      return;
    }

    try {

      const res = await api.post("/api/user-register/", { name, email, password });
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Now You can login',
        timer: 2000, // Auto close after 2 seconds
        showConfirmButton: false, // Hide the "OK" button
      }).then(() => {
        navigate("/"); // Navigate after SweetAlert
      });

      // navigate("/")

    } catch (error) {
      // Show SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.detail || 'An unexpected error occurred, please try again.',
      });
    } finally {
      setLoading(false)
    }
  }

  if (isAuthorized === null) {
    return <div>Loading...</div>;  // Show a loading indicator while checking authorization
  }

  if (isAuthorized) {
    return <Navigate to="/" />;  // Redirect to home page if authorized
  }
  return (

    <div className="app app-signup p-0">
      <div className="row g-0 app-auth-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          margin: 0,
        }}
      >
        <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
          <div className="d-flex flex-column align-content-end  border-start">
            <div className="app-auth-body mx-auto">
              <div className="app-auth-branding mb-4"><a className="app-logo" href="index.html">
                <img className="logo-icon me-2" src={logo} alt="logo" /></a></div>
              <h2 className="auth-heading text-center mb-4">Sign up to Portal</h2>

              <div className="auth-form-container text-start mx-auto ">
                <form className="auth-form auth-signup-form" onSubmit={(e) => handleSubmit(e)}>
                  <div className="email mb-3">
                    <label className="sr-only" htmlFor="signup-email">Your Name</label>
                    <input id="signup-name"
                      name="signup-name"
                      type="text"
                      className="form-control signup-email"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required="required" />
                  </div>
                  <div className="email mb-3">
                    <label className="sr-only" htmlFor="signup-email">Your Email</label>
                    <input id="signup-email"
                      name="signup-email"
                      type="email"
                      className="form-control signup-email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required="required" />
                  </div>
                  <div className="password mb-3">
                    <label className="sr-only" htmlFor="signup-password">Password</label>
                    <input id="signup-password"
                      name="signup-password"
                      type="password"
                      className="form-control signup-password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required="required" />
                  </div>
                  <div className="password mb-3">
                    <label className="sr-only" htmlFor="signup-password">Confirm Password</label>
                    <input id="signup-password2"
                      name="signup-password2"
                      type="password"
                      className="form-control signup-password"
                      placeholder="Create a password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required="required" />
                  </div>
                  {/* <div className="extra mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="" id="RememberPassword"/>
                        <label className="form-check-label" for="RememberPassword">
                          I agree to Portal's <a href="#" className="app-link">Terms of Service</a> and <a href="#" className="app-link">Privacy Policy</a>.
                        </label>
                    </div>
                  </div> */}

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn app-btn-primary w-100 theme-btn mx-auto"
                      disabled={loading} // Disable button while loading
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : "Register"}
                    </button>
                  </div>

                </form>
                <div className="auth-option text-center pt-2">
                  Already has an Account? Sign in{' '}
                  <span className="text-link"><Link to='/login'>here</Link></span>.

                </div>

              </div>

            </div>

          </div>
        </div>

      </div>


    </div>

  )

}

export default Register;