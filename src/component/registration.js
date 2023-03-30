import React, { useState } from 'react';
import './style.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

function RegistrationForm() {
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'nickName') {
      setNickName(value);
    }
    if (id === 'email') {
      setEmail(value);
    }
    if (id === 'password') {
      setPassword(value);
    }
    if (id === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const db = getFirestore();
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        nickName: nickName,
        email: email,
        password: password,
      });
      console.log('Document written with ID: ', docRef.id);
      alert('Registration successful');
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Registration failed');
    }
  };

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
}

export default RegistrationForm;
