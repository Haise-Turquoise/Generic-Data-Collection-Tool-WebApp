import { createSlice } from '@reduxjs/toolkit';

// const ISLOGGEDIN = (state, { payload }) => {
//   return {
//     ...state,
//     isLoggedIn: payload.isLoggedIn,
//   };
// };

// const SET_CURRENT_USER = (state, { payload }) => {
//   return {
//     ...state,
//     currentUser: payload.currentUser,
//   };
// };
// const initialState = {
//   isLoggedIn: false,
//   currentUser: '',

// };

// const reducers = {
//   ISLOGGEDIN,
//   SET_CURRENT_USER,
// };

// export const UserStore = createSlice({
//   name: 'USER',
//   initialState,
//   reducers,
// });
export const UserStore = createSlice({
  name: 'USER',
  initialState: {
    isLoggedIn: false,
    currentUser: '',
  },
  reducers: {
    ISLOGGEDIN: (state, { payload }) => ({
      response: {
        ...state,
        isLoggedIn: payload.isLoggedIn,
      },
    }),
  },
});

export default UserStore;
