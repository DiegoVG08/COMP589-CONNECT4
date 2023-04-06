import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, where, query as firestoreQuery } from "firebase/firestore";
import { db } from "../component/Firebase.js";
import bcrypt from "bcryptjs"; // Import bcrypt library
import { useNavigate } from "react-router-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUserByEmail = async (email) => {
    const usersRef = collection(db, "users");
    const q = firestoreQuery(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("User not found");
    }
    return querySnapshot.docs[0].data();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const auth = getAuth();
    try {
      const user = await getUserByEmail(email);
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
      }
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      setUser(user);
      navigate("/Home");
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="form" style={{ backgroundColor: "white", border: "2px solid black", alignContent: 'center', padding: '20px', }}>
  <div class="form-body">
    <div class="mb-3">
      <h3> Login</h3>
      <label for="email" class="form-label">Email</label>
      <input type="email" class="form-control" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
  </div>
  <div class="footer">
    {errorMessage && <p class="error">{errorMessage}</p>}
    {user && <p>Hello {user.username}</p>}
    <button type="submit" class="btn btn-primary" onClick={handleLogin} style={{ backgroundColor: "gray", border: "2px solid black" }}>
      {isLoading ? "Loading..." : "Login"}
    </button>
  </div>
</div>
  );
};

export default Login;
