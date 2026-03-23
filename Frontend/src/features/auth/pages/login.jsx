import React, { useState } from 'react'
import "../auth.form.scss";
import { useNavigate,Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const login = () => {

  const {handleLogin,loading} = useAuth();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin(email,password);
    if (success) {
      navigate("/");
    }
  }

  // if (loading) {
  //   return <h1 style={{textAlign: "center"}}>Loading.......</h1>;
  // }
  return (
    
        <main>
            <div className="form-container">
              <h1>Login</h1>
              <form onSubmit={handleSubmit}>
                <div className="input-group">  
                  <input onChange={(e)=>setEmail(e.target.value)}
                   type="text" placeholder='Username or Email' />
                </div>
                <div className="input-group">
                  <input 
                  onChange={(e)=>setPassword(e.target.value)}
                  type="password" placeholder='Password' />
                </div>
                <button type='submit' className='btn-primary'>Login</button>
              </form>
                
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    
  )
}

export default login