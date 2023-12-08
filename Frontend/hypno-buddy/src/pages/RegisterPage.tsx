import React, { useContext, useState } from 'react';
import AuthForm from '../components/AuthForm.tsx';
import { FlashContext } from '../contexts/FlashContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import Lottie, { AnimationConfigWithData } from 'lottie-web';
import LoginAnimation from '../assets/LoginAnimation.json';
import styled from 'styled-components';
import '../styles/LoginSignin.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const WelcomeHeading = styled.div`
    color: #f4e7e8;
    text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    margin: auto 0;
    font: 700 90px/109px Inter, sans-serif;

    position: absolute;
    top: 350px;
    left: 95px;
`;

const RegisterPage = () => {
    const { flash } = useContext(FlashContext);
    const { updateLoginState } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (event: any) => {
        event.preventDefault();
        const { first, last, email, password } = event.target.elements;

        try {
            const response = await fetch('http://localhost:3000/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first: first.value,
                    last: last.value,
                    email: email.value,
                    password: password.value,
                }),
            });
            const data = await response.json();
            flash(data.message);  // Display the message from the server
            console.log(data);
            flash(data.message);

            if (response.ok) {
                await updateLoginState(data.user);
            }
            navigate(data.redirect);
        } catch (error) {
            flash('An error occurred while registering');
            console.error('Registration error:', error);
        }
    };

    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => {
        setIsLogin((prevIsLogin) => !prevIsLogin);
    };

    const defaultOptions: AnimationConfigWithData<'svg'> = {
        loop: true,
        autoplay: true,
        animationData: LoginAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div className="position-relative vw-100 vh-100 overflow-hidden">
            <Lottie options={defaultOptions} height="100%" width="100%" className="position-absolute" />
            <WelcomeHeading className="display-1">Willkommen</WelcomeHeading>
            <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex flex-column justify-content-center align-items-center">
                <div className="c_dark" style={{ flexDirection: 'column' }}>
                    {isLogin ? (
                        <div>
                            <h1>Register</h1>
                            <AuthForm onSubmit={handleRegister} />
                        </div>
                    ) : (
                        <AuthForm onSubmit={handleRegister} />
                    )}
                    {isLogin ? (
                        <p className="mt-3">
                            Du hast bereits einen Account? <Link to="/login" className="link" onClick={toggleForm}>Login hier.</Link>
                        </p>
                    ) : (
                        <p className="mt-3">
                            Du hast noch kein Account? <Link to="/register" className="link" onClick={toggleForm}>Registriere dich hier.</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
