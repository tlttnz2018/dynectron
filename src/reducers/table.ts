import { createSlice } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { extractIndex, KeySchema } from '../services/extractIndex';

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    loading: false,
    tableName: '',
    keys: [] as KeySchema[],
    fields: [] as string[], // All attributeNames for showing hit
    tableSchema: {} as Record<string, unknown>,
    error: '',
  },
  reducers: {
    selectTable: (state, action) => {
      const { payload } = action;
      state.loading = true;
      state.tableName = payload;
      state.tableSchema = {};
      state.keys = [];
      state.fields = [];
      ipcRenderer.send('table-select', payload);
    },
    tableSchemaLoaded: (state, action) => {
      state.loading = false;
      const { payload } = action;
      // Try to extract AttributeName of table
      const attributeName = /"AttributeName":"(\w+)"/g;
      const fields = [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...new Set(
          [...payload.matchAll(attributeName)].map((match) => match[1])
        ),
      ];
      if (_.isEmpty(fields)) {
        state.tableSchema = {};
        state.keys = [];
        state.fields = [];
        state.error = payload;
      } else {
        const tableSchema = JSON.parse(payload);
        state.tableSchema = tableSchema;
        state.fields = fields;
        let allKeys = [];
        allKeys.push(
          tableSchema.KeySchema.reduce(
            (
              keys: KeySchema,
              obj: { AttributeName: string; KeyType: string }
            ) => {
              if (obj.KeyType === 'HASH') {
                keys.hash = obj.AttributeName;
              }
              if (obj.KeyType === 'RANGE') {
                keys.range = obj.AttributeName;
              }

              return keys;
            },
            {}
          )
        );

        if (tableSchema.GlobalSecondaryIndexes) {
          allKeys = allKeys.concat(
            extractIndex(tableSchema.GlobalSecondaryIndexes)
          );
        }

        if (tableSchema.LocalSecondaryIndexes) {
          allKeys.concat(extractIndex(tableSchema.LocalSecondaryIndexes));
        }

        state.keys = allKeys;
      }
    },
  },
});

export const { selectTable, tableSchemaLoaded } = tableSlice.actions;
export default tableSlice.reducer;
