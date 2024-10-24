import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: []
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    saveProjects(state, action) {
      state.projects = action.payload; // Save all projects data
    },
    clearProjects(state) {
      state.projects = [];
    }
  }
});

export const { saveProjects, clearProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
