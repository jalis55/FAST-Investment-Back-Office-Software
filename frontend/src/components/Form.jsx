import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_NAME } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoaginIndicator";

function Form({ route, method }) {



    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";



    const handleSubmit = async (e) => {
        console.log(route, method);
        setLoading(true);
        e.preventDefault();

        try {

            if(method=="register" && password !==confirmPassword){
                alert("Password does not match");
                return;
            }
            const res = await api.post("route", { email, password });

            if (method === "login") {

                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem(USER_NAME, email);
                navigate("/")
            } else {

                localStorage.clear();
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <form className="form-container" onSubmit={(e) => handleSubmit(e)}>
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {method == "register" ?
                <input
                    className="form-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />
                : null
            }



            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>

            <Link to={method == "register" ? '/login' : '/register'}>{method == 'register' ? "Login" : "Register"}</Link>
        </form>
    );
}

export default Form;