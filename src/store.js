import { DoorBackSharp } from '@mui/icons-material';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import thunk from 'redux-thunk';
import { db } from './component/Firebase';
import { getDatabase, onValue, ref, push, child, set, once, get, runTransaction } from "firebase/database";


const rootReducer = {
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    // Add other reducers if needed
  };
  
  const customMiddleware = (store) => (next) => (action) => {
    // Custom middleware logic
    next(action);
  };
  
  const middleware = [thunk.withExtraArgument({ db }), customMiddleware];
  
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware(), ...middleware],
  });
  
  // Retrieve the username from the Firebase Realtime Database
  const getUsernameFromUid = (uid) => {
    return new Promise((resolve, reject) => {
      const usersRef = ref(db, 'users');
      usersRef
        .child(uid)
        .child('username')
        .once('value', (snapshot) => {
          const username = snapshot.val();
          resolve(username);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  

  
  export default store;
