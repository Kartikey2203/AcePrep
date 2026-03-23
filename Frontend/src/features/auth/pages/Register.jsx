import React from 'react'
import { useNavigate,Link } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';


const Register = () => {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [username,setUsername] = useState("");

  const {handleRegister,loading} = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  await handleRegister(email, password, username);
  navigate("/");
}
if(loading){
  return (<main><h1>Loading.......</h1></main>);
}

  return (
    <main>
            <div className="form-container">
              <h1>Register</h1>
         <form onSubmit={handleSubmit}>
            
                <div className="input-group">  
                  <input
                  onChange={(e)=>setUsername(e.target.value)}
                  type="text" placeholder='Enter Username ' />
                </div>
                <div className="input-group">  
                  <input
                  onChange={(e)=>setEmail(e.target.value)}
                  type="text" placeholder='Enter Email' />
                </div>
                <div className="input-group">
                  <input
                  onChange={(e)=>setPassword(e.target.value)}
                  type="password" placeholder='Password' />
                </div>
                <button type='submit' className='btn-primary'>Register</button>
              </form>

            
            <p>Already have an account? <Link to="/login">Login</Link></p>


            </div>
        </main>
  )
}

export default Register