import React , {useState} from 'react'
import { Link } from 'react-router-dom'
import './auth.form.scss'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'



const Login = () => {
    const {loading , handleLogin} = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleLogin(email, password );
        navigate('/')
    }

    if(loading){
        return <main><h1>Loading...</h1></main>
    }

  return (
    <main>
        <div className='form-container'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} 
                     type="email" id="email"
                     placeholder='Enter your email'
                    />
                   
                </div>
                <div className='form-group'>
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" id="password" 
                     placeholder='Enter your password'
                    />
                </div>
                <button className='button-primary' >Login</button>



            </form>
            <p>Don't have an account? <Link to="/ragister">Register here</Link></p>
        </div>
    </main>
  )
}

export default Login