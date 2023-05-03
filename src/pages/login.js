import { useState } from "react";
import { initializeApp } from "firebase/app";
import { db } from "../component/Firebase.js";
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
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import login_text from "./login_text.js";

const Registration = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegistration = async (event) => {
    event.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Check if email already exists
    const database = getFirestore();
    const usersRef = collection(db, "users");
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
      const userData = {
        username: username,
        email: email,
        uid: user.uid,
        password: hashedPassword,
      };
      await addDoc(usersRef, userData);

      // Navigate to login screen after successful registration
      navigate("/Game");
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
    login_text
  );
};

export default Registration;
