import React from 'react'
import "../auth.form.scss";
const login = () => {
  return (
    
        <main>
            <div className="form-container">
              <h1>Login</h1>
              <form action="">
                <div className="input-group">  
                  <input type="text" placeholder='Username or Email' />
                </div>
                <div className="input-group">
                  <input type="password" placeholder='Password' />
                </div>
                <button type='submit' className='btn-primary'>Login</button>
              </form>
                
            </div>
        </main>
    
  )
}

export default login