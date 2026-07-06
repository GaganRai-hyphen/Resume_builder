import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Mail, Code } from 'lucide-react';
import AnimatedBlob from './AnimatedBlob';
import './auth.form.scss';

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(email, password);
        navigate('/');
    }

    if (loading) {
        return <main className="auth-main"><div className="loader">Loading...</div></main>
    }

    return (
        <main className="auth-main">
            <nav className="auth-nav">
                <div className="logo">ResuAI</div>
                <div className="nav-links">
                    <Link to="#">About</Link>
                    <Link to="#">Home</Link>
                    <Link to="#">Contacts</Link>
                    <Link to="#">Support</Link>
                </div>
            </nav>

            <div className="split-layout">
                <div className="left-panel">
                    <div className="form-container">
                        <h1>Login account</h1>
                        <p className="subtitle">Enter your credentials to access your account.</p>

                        <div className="social-login">
    <button type="button" className="social-btn"><FaGithub size={28}/></button>
    <button type="button" className="social-btn"><FaGoogle size={28}/></button>
</div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    value={email} 
                                    type="email" 
                                    id="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    value={password} 
                                    type="password" 
                                    id="password" 
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            <button className="button-primary" type="submit">Log in</button>
                        </form>
                        
                        <p className="switch-auth">
    Don't have an account? <Link to="/ragister">Sign up</Link>
             </p>
                    </div>
                </div>

                <div className="right-panel">
                    <AnimatedBlob />
                </div>
            </div>
        </main>
    )
}

export default Login;