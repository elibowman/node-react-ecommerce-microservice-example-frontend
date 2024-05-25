import { Form, Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useEffect, useRef, useContext } from "react";
import { MainContext } from "../store/MainContextWrapper";

export default function Login() {
    const loginFormDivRef = useRef<HTMLDivElement | null>(null);
    const loginForm = useRef<any>(null);
    const signupFormDivRef = useRef<HTMLDivElement | null>(null);
    const signupForm = useRef<any>(null);
    const { state: mainState, dispatch: mainDispatch } = useContext(MainContext);
    const navigate = useNavigate();

    useEffect(() => {
        
            loginForm.current = {
                email: loginFormDivRef.current?.querySelector('.login-username'),
                password: loginFormDivRef.current?.querySelector('.login-password'),
                submit: loginFormDivRef.current?.querySelector('.login-submit')
            }

            signupForm.current = {
                email: signupFormDivRef.current?.querySelector('.signup-username'),
                password: signupFormDivRef.current?.querySelector('.signup-password'),
                passwordConfirm: signupFormDivRef.current?.querySelector('.signup-confirm-password'),
                submit: signupFormDivRef.current?.querySelector('.signup-submit')
            }
    }, [loginFormDivRef, signupFormDivRef]);

    function LoginSignupLinkOnClick() {
        loginFormDivRef.current?.classList.toggle("inactive");
        signupFormDivRef.current?.classList.toggle("inactive");
    }

    const loginFormOnClick = () => {
        // e.preventDefault();
        const data = {
            email: loginForm.current.email.value,
            password: loginForm.current.password.value,
        }
        fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            if (!(data.error == null)) {
                throw new Error(data.error);
            }
            mainDispatch({
                type: 'setUidRefreshAndAccessToken',
                state: {
                    ...data
                }
            });
            localStorage.setItem('mainState', JSON.stringify({
                ...mainState,
                ...data
            }));
            
            alert('Login successful');
            navigate('/');
        })
        .catch((error) => {
            console.error("Error:", error);
            alert(error.message);
        });
    }

    const signupFormOnClick = () => {
        // e.preventDefault();
        const data = {
            email: signupForm.current.email.value,
            password: signupForm.current.password.value,
            passwordConfirm: signupForm.current.passwordConfirm.value
        } 
        // fetch("http://localhost:3000/api/login", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(data),
        // })
        // .then((response) => response.json())
        // .then((data) => {
            // console.log("Success:", data);
        // })
        // .catch((error) => {
        //     console.error("Error:", error);
        // });   
    }
    
    

    return (
        <>
            <NavBar/>
            <div className="login-signup-div-wrapper">
                <div className="login-signup-div">
                <div className="login-form-div"  ref={loginFormDivRef}>
                    <Form action="#" className="login-form">
                    <div>Login</div>
                    <input
                        className="login-username"
                        type="text"
                        name="username"
                        placeholder="Enter username"
                    />
                    <input
                        className="login-password"
                        type="password"
                        name="password"
                        placeholder="Enter password"
                    />
                    <input 
                        className="login-submit" 
                        type="submit"
                        value="Submit" 
                        onClick={loginFormOnClick}
                    />
                    <span className="login-link">
                        Not a member? <Link to="#" onClick={LoginSignupLinkOnClick}>Signup</Link>
                    </span>
                    </Form>
                </div>
                <div className="signup-form-div inactive" ref={signupFormDivRef}>
                    <Form action="#" className="signup-form" method="POST">
                    <div>Signup</div>
                    <input
                        className="signup-username"
                        type="text"
                        name="username"
                        placeholder="Enter username"
                    />
                    <input
                        className="signup-password"
                        type="password"
                        name="password"
                        placeholder="Enter password"
                    />
                    <input
                        className="signup-confirm-password"
                        type="password"
                        name="confirm-password"
                        placeholder="Confirm password"
                    />
                    <input
                        className="signup-submit"
                        type="submit"
                        value="Submit"
                        onClick={signupFormOnClick}
                    />
                    <span className="signup-link">
                        Already have account? <Link to="#" onClick={LoginSignupLinkOnClick}>Login</Link>
                    </span>
                    </Form>
                </div>
                </div>
            </div>
        </>

    );
}