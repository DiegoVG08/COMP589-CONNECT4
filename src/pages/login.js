import { useState } from "react";
import { initializeApp } from "firebase/app";
import { database } from "../component/Firebase.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";


import "./style.css";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async (event) => {
    event.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Check if email already exists
    const database = getFirestore();
    const usersRef = collection(database, "users");
    const querySnapshot = await getDocs(
      query(usersRef, where("email", "==", email))
    );
    if (!querySnapshot.empty) {
      setErrorMessage("Email already exists");
      return;
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const auth = getAuth();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await getFirestore().collection('users').doc(user.uid).set({
        username: username,
        email: email,
        uid: user.uid,
        password: hashedPassword,
      });

      // Navigate to login screen after successful registration
      navigate("/Home");
    } catch (error) {
      setErrorMessage(error.message);
      return;
    }

    // Reset form
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };
  

  return (
    <div className="form">
      <div className="form-body">
        <div className="username">
          <label className="form__label" htmlFor="username">
            Username:
          </label>
          <input
            className="form__input"
            type="text"
            id="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="email">
          <label className="form__label" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="form__input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="password">
          <label className="form__label" htmlFor="password">
            Password:
          </label>
          <input
            className="form__input"
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="confirm-password">
          <label className="form__label" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            className="form__input"
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="footer">
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className="btn" onClick={handleRegistration}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Registration;
