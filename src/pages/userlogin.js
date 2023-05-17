import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../component/authContext.js"; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, where, query as firestoreQuery } from "firebase/firestore";
import { db } from "../component/Firebase.js";
import bcrypt from "bcryptjs"; // Import bcrypt library
import { useNavigate, Link } from "react-router-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const auth = getAuth();

  const getUserByEmail = async (email) => {
    const usersRef = collection(db, "users");
    const q = firestoreQuery(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("User not found");
    }
    return querySnapshot.docs[0].data();
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const user = await getUserByEmail(email);
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
      }
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
     // handleLogin(user); // Call the handleLogin function from the AuthContext and pass the user data
      navigate("/Account");
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        const uid = user.uid;
        const usersRef = collection(db, 'users');
        const q = firestoreQuery(usersRef, where('uid', '==', uid));
        getDocs(q)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              setUser(userData);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // User is signed out
        setUser(null);
      }
    });
  
    // Fetch the user information when the Account page is accessed
    const currentPath = window.location.pathname;
    if (currentPath === '/Account') {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const usersRef = collection(db, 'users');
        const q = firestoreQuery(usersRef, where('uid', '==', uid));
        getDocs(q)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              setUser(userData);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  
    return unsubscribe;
  }, [auth]);

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
    <button type="submit" class="btn btn-primary" onClick={handleLoginSubmit} style={{ backgroundColor: "gray", border: "2px solid black", marginLeft: '15px' }}>
      {isLoading ? "Loading..." : "Login"}
    </button>
  </div>
  <div style={{ marginTop: "20px" }}>
          <p>Don't have an account? <Link to="/Register" class="btn btn-primary" style={{ backgroundColor: "gray", border: "2px solid black" }}>Register</Link> </p>
        </div>
</div>
  );
};

export default Login;
