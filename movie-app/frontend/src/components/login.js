import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/login', {
                email,
                password,
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);

            navigate('/'); 
        } catch (error) {
            setErrorMessage(error.response ? error.response.data.message : 'Server error');
        }
    };

    return (
        <div className="wrapper">
            <h2>Login</h2>
            {errorMessage && <p>{errorMessage}</p>}
            <form onSubmit={handleLogin}>
                <div className="input-box">
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email" 
                        required
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
