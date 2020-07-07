import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { Condition, Operator } from '../components/Condition';
import { queryGenerator } from '../services/queryGeneratorService';
import nextId from '../services/nextId';

const queryGeneratorSlice = createSlice({
  name: 'queryGenerator',
  initialState: {
    conditions: [{ id: nextId(), operator: '=' as Operator }] as Condition[],
    query: '' as string,
    error: '' as string,
  },
  reducers: {
    updateConditions: (state, action) => {
      const { conditions, tableSpecification } = action.payload;
      state.conditions = conditions;

      // Tried to generate query from table specification
      // First check whether key field does exist
      const fields: string[] = conditions
        .map((condition: Condition) => {
          return condition.name;
        })
        .filter((field: string) => !!field);

      if (_.isEmpty(fields)) {
        state.error = 'Please specify one key field';
        state.query = '';
      } else {
        const queryGenerated = queryGenerator(conditions, tableSpecification);
        if (typeof queryGenerated === 'string') {
          state.error = queryGenerated;
          state.query = '';
        } else {
          state.error = '';
          state.query = JSON.stringify(queryGenerated);
        }
      }
    },
  },
});

export const { updateConditions } = queryGeneratorSlice.actions;
export default queryGeneratorSlice.reducer;
