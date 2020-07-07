import { createSlice } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import _ from 'lodash';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    loading: false,
    profiles: [] as string[],
    error: '',
  },
  reducers: {
    loadProfiles: (state) => {
      state.loading = true;
      state.profiles = [];
      state.error = '';
      ipcRenderer.send('account-profiles-request');
    },
    profilesLoaded: (state, action) => {
      state.loading = false;
      const { payload } = action;
      if (_.isEmpty(payload) || !_.isArray(payload)) {
        if (_.isString(payload)) {
          state.error = payload;
        }
        state.profiles = [];

        return;
      }

      state.error = '';
      state.profiles = payload;
    },
  },
});

export const { loadProfiles, profilesLoaded } = appSlice.actions;
export default appSlice.reducer;
