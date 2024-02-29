// import {createSlice} from "@reduxjs/toolkit";
//
// const authSlice = createSlice({
//   name: 'authSlice',
//   initialState: {
//     isLoggedIn: false,
//     username: 'User',
//     memberId: '0',
//   },
//   reducers: {
//     login: (state, action) => {
//       state.isLoggedIn = true;
//       state.username = action.payload.username;
//       state.memberId = action.payload.memberId;
//     },
//     getLoginInfo: (state, action) => {
//       state.username = localStorage.getItem('username') || 'User';
//       state.memberId = localStorage.getItem('memberId') || '0';
//     },
//     logout: (state) => {
//       state.isLoggedIn = false;
//       state.username = 'User';
//       state.memberId = '0';
//       localStorage.removeItem('username');
//       localStorage.removeItem('memberId');
//     }
//   }
// });
//
// export default authSlice;
// export const {login} = authSlice.actions;
// export const {getLoginInfo} = authSlice.actions;
// export const {logout} = authSlice.actions;