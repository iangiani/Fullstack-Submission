import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import { setNotificationWithTimeout } from './notificationReducer';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updated = action.payload;
      return state
        .map((b) => (b.id === updated.id ? updated : b))
        .sort((a, b) => b.likes - a.likes);
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((b) => b.id !== id);
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogsSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  };
};

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    try {
      const created = await blogService.create(blogObject);
      dispatch(appendBlog(created));
      dispatch(
        setNotificationWithTimeout(
          `a new blog ${created.title} by ${created.author} added`,
          'success',
          5
        )
      );
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      dispatch(setNotificationWithTimeout('blog creation failed', 'error', 5));
    }
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user,
    };

    try {
      const returned = await blogService.update(blog.id, updatedBlog);
      dispatch(updateBlog(returned));
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      dispatch(setNotificationWithTimeout('like failed', 'error', 5));
    }
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return;

    try {
      await blogService.remove(blog.id);
      dispatch(removeBlog(blog.id));
      dispatch(
        setNotificationWithTimeout(`Deleted: ${blog.title}`, 'success', 5)
      );
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      dispatch(setNotificationWithTimeout('blog remove failed', 'error', 5));
    }
  };
};

export default blogsSlice.reducer;
