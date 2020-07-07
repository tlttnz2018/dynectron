import { createSlice } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { ColDef } from 'ag-grid-community';
import { KeySchema } from '../services/extractIndex';

const sampleQuery = `{
    // Please remove comments below before running
    "TableName" : "Table-dev", // This table field will override the table you chose on the left.
    "ProjectionExpression":"#yr, title, info.genres, info.actors[0]", // Only columns you want or remove to get all cols
    "KeyConditionExpression": "#DYNECTRON_partitionId = :pkey", // columns: 1-2 columns in global primary index. For example " and id = :id"
    "FilterExpression": "country = :country", // filter rows based on condition. Can be and/or with other columns
    "ExpressionAttributeNames":{
        "#yr": "year",
        "#DYNECTRON_partitionId":"partitionId"
    },
    "ExpressionAttributeValues": {
        ":yyyy": 1992,
        ":letter1": "A",
        ":letter2": "L",
        ":pkey":"aa63eae1-4fc7-4438-9dff-f588bcbf036f",
        ":country": "AU"
    },
   "ScanIndexForward":true,
}`;

const querySlice = createSlice({
  name: 'query',
  initialState: {
    loading: false,
    query: sampleQuery,
    tableName: '',
    keys: [] as KeySchema[],
    data: [] as Record<string, unknown>[],
    count: 0,
    error: '',
    lastEvaluatedKey: '',
    isScan: false,
    hasMore: false,
    runningQuery: '',
    total: 0,
    totalScanned: 0,
    columnHeaders: [] as ColDef[],
  },
  reducers: {
    updateQuery: (state, action) => {
      const { payload } = action;
      state.query = payload;
    },

    queryData: (state, action) => {
      state.isScan = false;
      const { query, keys, name, next } = action.payload;
      state.loading = true;
      state.error = '';
      state.tableName = '';
      let { runningQuery } = state;

      if (keys) {
        state.keys = keys;
      }

      if (!next || (query && query !== state.runningQuery)) {
        state.data = [];
        state.columnHeaders = [];
        state.count = 0;
        state.lastEvaluatedKey = '';
        state.hasMore = false;
        state.total = 0;
        state.totalScanned = 0;

        runningQuery = query || state.query;
        state.runningQuery = runningQuery;
      }

      ipcRenderer.send('query-execute', {
        ...(name ? { name } : {}),
        queryJson: runningQuery,
        exclusiveStartKey: state.lastEvaluatedKey || undefined,
      });
    },
    scanData: (state, action) => {
      state.isScan = true;
      const { conditions, next } = action.payload;
      state.loading = true;
      state.error = '';
      if (conditions.tableName) {
        state.tableName = conditions.tableName;
      }
      if (conditions.keys) {
        state.keys = conditions.keys;
      }

      if (!next) {
        state.data = [];
        state.columnHeaders = [];
        state.count = 0;
        state.lastEvaluatedKey = '';
        state.hasMore = false;
        state.total = 0;
        state.totalScanned = 0;
      }

      ipcRenderer.send('scan-execute', {
        name: conditions.tableName || state.tableName,
        scanJson: JSON.stringify({
          ...conditions,
        }),
        exclusiveStartKey: state.lastEvaluatedKey || undefined,
      });
    },

    dataLoaded: (state, action) => {
      state.loading = false;
      const { payload } = action;
      if (_.isString(payload)) {
        state.error = payload;
        state.tableName = '';
        state.data = [];
        state.columnHeaders = [];
        state.total = 0;
        state.totalScanned = 0;
        state.keys = [];
      } else if (_.isEmpty(payload.data)) {
        state.error = 'No data found';
        state.tableName = '';
        state.keys = [];
        state.data = [];
        state.columnHeaders = [];
        state.total = 0;
        state.totalScanned = 0;
      } else {
        const { name, data, lastEvaluatedKey, queryInfo } = payload;
        const systemInfo = JSON.parse(queryInfo);
        state.tableName = name;

        if (data[0].count) {
          state.count += data[0].count;
          if (_.isEmpty(state.columnHeaders)) {
            state.columnHeaders = [
              {
                headerName: 'Count',
                field: 'count',
              },
            ] as ColDef[];
          }
        } else {
          const newData = state.data.concat(data);
          state.data = newData;

          if (!_.isEmpty(newData)) {
            const fields = newData.reduce((acc, current) => {
              // eslint-disable-next-line compat/compat
              const keys = Object.keys(current);
              return acc.concat(keys);
            }, [] as string[]);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const uniqueFields = [...new Set(fields)];

            const newColumnHeaders = uniqueFields.map((fieldName: string) => {
              return {
                headerName: fieldName,
                field: fieldName,
              } as ColDef;
            });
            state.columnHeaders.forEach((col) => {
              // Copy state
              const colFound = newColumnHeaders.find((column) => {
                return column.headerName === col.headerName;
              });

              if (colFound) {
                _.assign(colFound, col);
              }
            });

            state.columnHeaders = newColumnHeaders;
          }
        }

        state.total += systemInfo.Count;
        state.totalScanned += systemInfo.ScannedCount;
        state.error = '';
        state.lastEvaluatedKey = lastEvaluatedKey;
        state.hasMore = !!lastEvaluatedKey; // Last query can have no more lastEvaluatedKey
      }
    },
    toggleColumnVisible: (state, action) => {
      const { index } = action.payload;
      state.columnHeaders[index].hide = !state.columnHeaders[index].hide;
    },
    toggleAllColumnVisible: (state, action) => {
      state.columnHeaders.forEach((column) => {
        column.hide = !action.payload;
      });
    },
  },
});

export const {
  updateQuery,
  queryData,
  dataLoaded,
  scanData,
  toggleColumnVisible,
  toggleAllColumnVisible,
} = querySlice.actions;
export default querySlice.reducer;
