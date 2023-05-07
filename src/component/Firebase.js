import { initializeApp } from "firebase/app";
import {getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDzqybU1xrDVMRwwMJO9puu7vi0yyo4q_c",
  authDomain: "connect4-5c4c3.firebaseapp.com",
  projectId: "connect4-5c4c3",
  storageBucket: "connect4-5c4c3.appspot.com",
  messagingSenderId: "200257950339",
  appId: "1:200257950339:web:15db5ec03ebc5b864001b6",
  measurementId: "G-LQ1EM8H0WQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



export { auth, db, app };