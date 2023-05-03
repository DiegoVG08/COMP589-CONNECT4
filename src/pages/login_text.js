import React from 'react';
import {handleRegistration, Registration} from "../pages/login"

const login_text = () => {
    return(

<div className="form" style={{ backgroundColor: "white", border: "2px solid black" }}>
  <div class="form-body" >
    <div class="form-group">
      <h4>Registration</h4>
      <label class="form-label" for="username">Username:</label>
      <input class="form-control" type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
    </div>
    <div class="form-group">
      <label class="form-label" for="email">Email:</label>
      <input type="email" id="email" class="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
    <div class="form-group">
      <label class="form-label" for="password">Password:</label>
      <input class="form-control" type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
    <div class="form-group">
      <label class="form-label" for="confirmPassword">Confirm Password:</label>
      <input class="form-control" type="password" id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
    </div>
  </div>

  <div class="footer">
    <button type="submit" className="btn btn-primary" onClick={handleRegistration}  style={{ backgroundColor: "gray", border: "2px solid black", marginLeft: '15px' }}>Register</button>
  </div>
  {errorMessage && <p class="error">{errorMessage}</p>}
  <div style={{ marginTop: "5px" }}>
          <p> <Link to="/Home" class="btn btn-primary" style={{ backgroundColor: "gray", border: "2px solid black" }}>Already have an account?</Link> </p>
        </div>
</div>
);
};
  
export default login_text;