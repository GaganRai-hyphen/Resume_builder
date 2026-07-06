import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Mail, Code } from 'lucide-react';
import AnimatedBlob from './AnimatedBlob';
import './auth.form.scss';

const Ragister = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loading, handleRegister } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister(username, email, password);
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
                        <h1>Sign up account</h1>
                        <p className="subtitle">Enter your personal data to create your account.</p>

                        <div className="social-login">
    <button type="button" className="social-btn"><FaGithub size={28}/></button>
    <button type="button" className="social-btn"><FaGoogle size={28}/></button>
</div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    id="username"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    type="email" 
                                    id="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    type="password" 
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="button-primary" type="submit">Sign up</button>
                        </form>
                        
                        <p className="switch-auth">
                            Already have an account? <Link to="/login">Log in</Link>
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

export default Ragister;