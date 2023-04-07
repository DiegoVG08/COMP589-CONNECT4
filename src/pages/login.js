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
    {errorMessage && <p class="error">{errorMessage}</p>}
    <button type="submit" className="btn btn-primary" onClick={handleRegistration} style={{ backgroundColor: "gray", border: "2px solid black", marginLeft: '15px' }}>Register</button>
  </div>
  <div style={{ marginTop: "20px" }}>
          <p>Already have an account? <Link to="/Home" class="btn btn-primary" style={{ backgroundColor: "gray", border: "2px solid black" }}>Login</Link> </p>
        </div>
</div>

  );
};

export default Registration;
