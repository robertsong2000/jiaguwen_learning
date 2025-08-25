import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, UserState, LearningProgress, Achievement } from '../types';
import { authAPI, userAPI } from '../../services/api';

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    const response = await authAPI.login(credentials);
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { username: string; email: string; password: string; displayName: string }) => {
    const response = await authAPI.register(userData);
    return response.data;
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    const response = await userAPI.getProfile();
    return response.data;
  }
);

export const updateUserProgress = createAsyncThunk(
  'user/updateProgress',
  async (progressData: Partial<LearningProgress>) => {
    const response = await userAPI.updateProgress(progressData);
    return response.data;
  }
);

export const fetchUserAchievements = createAsyncThunk(
  'user/fetchAchievements',
  async () => {
    const response = await userAPI.getAchievements();
    return response.data;
  }
);

const initialState: UserState = {
  profile: null,
  progress: null,
  achievements: [],
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.profile = null;
      state.progress = null;
      state.achievements = [];
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    updateLocalProgress: (state, action: PayloadAction<Partial<LearningProgress>>) => {
      if (state.progress) {
        state.progress = { ...state.progress, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data.user;
        state.progress = action.payload.data.progress;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('refreshToken', action.payload.data.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '登录失败';
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data.user;
        state.progress = action.payload.data.progress;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('refreshToken', action.payload.data.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '注册失败';
      })
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data.profile;
        state.progress = action.payload.data.progress;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户信息失败';
        state.isAuthenticated = false;
      })
      // Update progress
      .addCase(updateUserProgress.fulfilled, (state, action) => {
        state.progress = action.payload.data;
      })
      // Fetch achievements
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload.data;
      });
  },
});

export const {
  logout,
  clearError,
  setAuthenticated,
  updateLocalProgress,
} = userSlice.actions;

export default userSlice.reducer;