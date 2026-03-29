import React, { useState } from 'react'
import "../auth.form.scss";
import { useNavigate,Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const login = () => {
  console.log("Login page rendered");
  
  const {handleLogin,loading} = useAuth();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    const success = await handleLogin(email,password);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid Email/Username or Password. Please try again.");
    }
  }

  return (
        <main>
            <div className="form-container">
              <h1>Login</h1>
              {error && <div style={{color: '#ff4d4f', marginBottom: '1rem', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', padding: '10px', borderRadius: '4px'}}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="input-group">  
                  <input onChange={(e)=>setEmail(e.target.value)}
                   type="text" placeholder='Username or Email' required />
                </div>
                <div className="input-group">
                  <input 
                  onChange={(e)=>setPassword(e.target.value)}
                  type="password" placeholder='Password' required />
                </div>
                <button type='submit' className='btn-primary'>Login</button>
              </form>
                
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
  )
}

export default login