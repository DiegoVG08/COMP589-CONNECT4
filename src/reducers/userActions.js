// actions/userActions.js
import { db } from '../component/Firebase'; // Your Firestore instance

export const fetchUsername = (uid) => {
  return async (dispatch) => {
    try {
      const userRef = db.collection('users').doc(uid);
      const userSnapshot = await userRef.get();
      if (userSnapshot.exists) {
        const username = userSnapshot.data().username;
        dispatch({ type: 'FETCH_USERNAME_SUCCESS', payload: username });
      } else {
        dispatch({ type: 'FETCH_USERNAME_FAILURE', payload: 'User not found' });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_USERNAME_FAILURE', payload: error.message });
    }
  };
};
