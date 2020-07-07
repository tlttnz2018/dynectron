// Create redux store
import { configureStore } from '@reduxjs/toolkit';

import { combineReducers } from 'redux';
import { ipcRenderer } from 'electron';
import appReducer, { profilesLoaded } from './reducers/app';
import profileReducer, { tablesLoaded } from './reducers/profile';
import tableReducer, { tableSchemaLoaded } from './reducers/table';
import queryReducer, { dataLoaded } from './reducers/query';
import queryGeneratorReducer from './reducers/queryGenerator';

const rootReducer = combineReducers({
  app: appReducer,
  profile: profileReducer,
  table: tableReducer,
  query: queryReducer,
  queryGenerator: queryGeneratorReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

// Listeners
ipcRenderer.on('account-profiles-reply', (_event, arg) => {
  store.dispatch(profilesLoaded(arg));
});

ipcRenderer.on('table-list', (_event, arg) => {
  store.dispatch(tablesLoaded(arg));
});

ipcRenderer.on('table-data', (_event, arg) => {
  store.dispatch(tableSchemaLoaded(arg));
});

ipcRenderer.on('query-data', (_event, arg) => {
  store.dispatch(dataLoaded(arg));
});

ipcRenderer.on('scan-data', (_event, arg) => {
  store.dispatch(dataLoaded(arg));
});

export default store;
