import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogService from '../services/blogs';
import { setNotificationWithTimeout } from './notificationReducer';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);

      dispatch(setUser(user));
      dispatch(setNotificationWithTimeout('login successful', 'success', 5));
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      dispatch(
        setNotificationWithTimeout('wrong username or password', 'error', 5)
      );
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser');
    blogService.setToken(null);
    dispatch(clearUser());
  };
};

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  };
};

export default userSlice.reducer;
