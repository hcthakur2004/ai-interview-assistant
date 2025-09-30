import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  searchTerm: '',
  sortBy: 'score', // 'score', 'name', 'date'
  sortOrder: 'desc', // 'asc', 'desc'
};

export const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      // Add a new candidate with a unique ID
      const newCandidate = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...action.payload,
      };
      state.list.push(newCandidate);
    },
    updateCandidate: (state, action) => {
      const { id, ...updates } = action.payload;
      const candidateIndex = state.list.findIndex(candidate => candidate.id === id);
      if (candidateIndex !== -1) {
        state.list[candidateIndex] = { ...state.list[candidateIndex], ...updates };
      }
    },
    removeCandidate: (state, action) => {
      state.list = state.list.filter(candidate => candidate.id !== action.payload);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    resetCandidates: () => initialState,
  },
});

export const {
  addCandidate,
  updateCandidate,
  removeCandidate,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  resetCandidates,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;