import { combineReducers } from 'redux';
import isLoggedInReducer from './isLoggedInReducer'; // Import your isLoggedIn reducer
import userReducer from './userReducer'; 
import { firestoreReducer } from 'redux-firestore';
import { ActionTypes } from './actions';


const initialState = {
    isLoggedIn: false,
    user: null
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case ActionTypes.LOG_IN:
        return {
          ...state,
          isLoggedIn: true,
          user: action.payload
        };
      case ActionTypes.LOG_OUT:
        return {
          ...state,
          isLoggedIn: false,
          user: null
        };
      default:
        return state;
    }
  };
  
  export default rootReducer;