import useCheckAuthorized from '../CheckAuthorized'; // Custom hook
import Spinner from 'react-bootstrap/Spinner';
import logo from "../images/app-logo.svg";
import { useState } from "react";
import api from "../api";
import { Link,useNavigate,Navigate} from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_NAME } from "../constants";
import Swal from 'sweetalert2'; // Import SweetAlert2

function Login() {
    const isAuthorized = useCheckAuthorized(); // Check authorization status
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); // Show spinner during API call

        try {
            const res = await api.post("/api/token/", { email, password });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            localStorage.setItem(USER_NAME, email);
            navigate("/"); // Redirect to home page after successful login
        } catch (error) {
            // Show SweetAlert error message
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.detail || 'An unexpected error occurred, please try again.',
            });
        } finally {
            setLoading(false); // Hide spinner after the API call finishes
        }
    };

    if (isAuthorized === null) {
        return (
            <div>
                <Spinner animation="border" size="sm" />
                <Spinner animation="border" />
            </div>
        );
    }

    if (isAuthorized) {
        return <Navigate to="/" />; // Redirect to home page if authorized
    }

    return (
        <div className="app app-login p-0">
            <div className="row g-0 app-auth-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0 }}>
                <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5" style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <div className="app-auth-body mx-auto">
                        <div className="app-auth-branding mb-4">
                            <a className="app-logo" href="index.html">
                                <img className="logo-icon me-2" src={logo} alt="logo" />
                            </a>
                        </div>
                        <h2 className="auth-heading text-center mb-5">Log in to Portal</h2>
                        <div className="auth-form-container text-start">
                            <form className="auth-form login-form" onSubmit={handleSubmit}>
                                <div className="email mb-3">
                                    <label className="sr-only" htmlFor="signin-email">Email</label>
                                    <input
                                        id="signin-email"
                                        type="email"
                                        className="form-control signin-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email address"
                                        required
                                    />
                                </div>
                                <div className="password mb-3">
                                    <label className="sr-only" htmlFor="signin-password">Password</label>
                                    <input
                                        id="signin-password"
                                        type="password"
                                        className="form-control signin-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn app-btn-primary w-100 theme-btn mx-auto"
                                        disabled={loading} // Disable button while loading
                                    >
                                        {loading ? <Spinner animation="border" size="sm" /> : "Log In"}
                                    </button>
                                </div>
                            </form>

                            <div className="auth-option text-center pt-3">
                                No Account? Sign up{' '}
                                <span className="text-link"><Link to='/register'>here</Link></span>.

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
