import { createSlice } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import _ from 'lodash';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    loading: false,
    profileName: '',
    searchText: '',
    fullTables: [] as string[],
    tables: [] as string[],
    error: '',
  },
  reducers: {
    selectProfile: (state, action) => {
      const { payload: profileName } = action;
      state.loading = true;
      state.profileName = profileName;
      state.fullTables = [];
      state.tables = [];
      state.searchText = '';
      ipcRenderer.send('profile-select', profileName);
    },
    searchTable: (state, action) => {
      const { payload: text } = action;
      state.searchText = text;

      if (!text) {
        state.tables = state.fullTables;
      }

      const searchRegex = new RegExp(text, 'i');
      state.tables = _.filter(state.fullTables, function contains(
        table: string
      ) {
        return searchRegex.test(table);
      });
    },
    tablesLoaded: (state, action) => {
      state.loading = false;
      const { payload } = action;

      if (_.isString(payload)) {
        state.error = payload;
        state.fullTables = [];
        state.tables = [];
      } else {
        state.fullTables = payload;
        state.tables = payload;
        state.error = '';
      }
    },
  },
});

export const {
  selectProfile,
  tablesLoaded,
  searchTable,
} = profileSlice.actions;
export default profileSlice.reducer;
