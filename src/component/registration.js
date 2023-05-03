import React, { useState } from 'react';
import './style.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {registration_login_text} from '..pages/registration_login_text'

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
   registration_login_text
  );
  
};

export default RegistrationForm;
