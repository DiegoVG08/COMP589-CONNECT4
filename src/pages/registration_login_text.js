import React from 'react';
import {handleInputChange, handleSubmit} from "../component/registration"

const registration_login_text = () => {
    return (
    <div className="form">
<div className="form-body">
  <div className="nickName">
    <label className="form__label" htmlFor="nickName">
      Nickname
    </label>
    <input
      className="form__input"
      type="text"
      value={nickName}
      onChange={(e) => handleInputChange(e)}
      id="nickName"
      placeholder="Nickname"
    />
  </div>
  <div className="email">
    <label className="form__label" htmlFor="email">
      Email
    </label>
    <input
      type="email"
      id="email"
      className="form__input"
      value={email}
      onChange={(e) => handleInputChange(e)}
      placeholder="Email"
    />
  </div>
  <div className="password">
    <label className="form__label" htmlFor="password">
      Password
    </label>
    <input
      className="form__input"
      type="password"
      id="password"
      value={password}
      onChange={(e) => handleInputChange(e)}
      placeholder="Password"
    />
  </div>
  <div className="confirm-password">
    <label className="form__label" htmlFor="confirmPassword">
      Confirm Password
    </label>
    <input
      className="form__input"
      type="password"
      id="confirmPassword"
      value={confirmPassword}
      onChange={(e) => handleInputChange(e)}
      placeholder="Confirm Password"
    />
  </div>
</div>
<div className="footer">
  <button onClick={handleSubmit} type="submit" className="btn">
    Register
  </button>
</div>
</div>

);
};
  
export default registration_login_text;