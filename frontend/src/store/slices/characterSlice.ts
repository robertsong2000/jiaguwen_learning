import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Character, CharacterState, FilterConfig, PaginatedResponse } from '../types';
import { characterAPI } from '../../services/api';

// Async thunks
export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async (params: { page?: number; limit?: number; filters?: FilterConfig }) => {
    const response = await characterAPI.getCharacters(params);
    return response.data;
  }
);

export const fetchCharacterById = createAsyncThunk(
  'characters/fetchCharacterById',
  async (id: string) => {
    const response = await characterAPI.getCharacterById(id);
    return response.data;
  }
);

export const searchCharacters = createAsyncThunk(
  'characters/searchCharacters',
  async (query: string) => {
    const response = await characterAPI.searchCharacters(query);
    return response.data;
  }
);

const initialState: CharacterState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
};

const characterSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setSelectedCharacter: (state, action: PayloadAction<Character | null>) => {
      state.selected = action.payload;
    },
    updateFilters: (state, action: PayloadAction<FilterConfig>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch characters
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload.data;
        state.list = response.data;
        state.pagination = {
          page: response.page,
          limit: response.limit,
          total: response.total,
        };
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取字符失败';
      })
      // Fetch character by ID
      .addCase(fetchCharacterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacterById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload.data;
      })
      .addCase(fetchCharacterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取字符详情失败';
      })
      // Search characters
      .addCase(searchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(searchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '搜索失败';
      });
  },
});

export const {
  setSelectedCharacter,
  updateFilters,
  clearFilters,
  setPage,
  clearError,
} = characterSlice.actions;

export default characterSlice.reducer;