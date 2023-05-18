// actions.js

// actions.js

export const ActionTypes = {
    LOG_IN: 'LOG_IN',
    LOG_OUT: 'LOG_OUT',
    SET_USER: 'SET_USER',
    CLEAR_USER: 'CLEAR_USER'
  };
  
  export const logIn = (user) => ({
    type: ActionTypes.LOG_IN,
    payload: user
  });
  
  export const logOut = () => ({
    type: ActionTypes.LOG_OUT
  });
  
  export const setUser = (user) => ({
    type: ActionTypes.SET_USER,
    payload: user
  });
  
  export const clearUser = () => ({
    type: ActionTypes.CLEAR_USER
  });

  
  