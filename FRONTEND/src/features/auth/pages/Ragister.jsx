import React from 'react'
import { useState } from 'react';
import {useNavigate , Link} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'


const Ragister = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {loading , handleRegister} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
      await handleRegister(username, email, password);
        navigate('/');
    }

    if(loading){
        return <main><h1>Loading...</h1></main>
    }

  return (
    <main>

        <div className='form-container'>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username"
                        placeholder='Enter your username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                   
                </div>

                <div className='form-group'>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                   
                </div>
                <div className='form-group'>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className='button-primary' >Register</button>
                


            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p> 
        </div>
    </main>
  )
}

export default Ragister