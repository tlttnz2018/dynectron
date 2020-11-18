import React from 'react';
import { Button, Container } from '@material-ui/core';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  queryData as queryDataAction,
  scanData as scanDataAction,
} from '../reducers/query';
import { KeySchema } from '../services/extractIndex';

function ControlBar({
  tabNo,
  query,
  queryGenerated,
  queryData,
  scanData,
  tableName,
  tables,
  keys,
  loading,
}: {
  tabNo: number;
  query: string;
  queryGenerated: string;
  queryData: ({
    query,
    keys,
    name,
    next,
  }: {
    query?: string;
    keys: KeySchema[];
    name: string;
    next: boolean;
  }) => void;
  scanData: ({
    conditions,
    next,
  }: {
    conditions: Record<string, unknown>;
    next: boolean;
  }) => void;
  tableName: string;
  tables: string[];
  keys: KeySchema[];
  loading: boolean;
}) {
  return (
    <Container maxWidth={false} style={{ padding: 0 }}>
      <Button
        disabled={
          _.isEmpty(query) ||
          _.isEmpty(tables) ||
          (tabNo === 0 && !tableName) ||
          loading
        }
        onClick={() => {
          queryData({
            ...(tabNo === 0 ? { query: queryGenerated } : {}),
            keys,
            name: tableName,
            next: false,
          });
        }}
      >
        Query
      </Button>
      <Button
        disabled={_.isEmpty(tableName) || loading}
        onClick={() => {
          scanData({
            conditions: {
              tableName,
              keys,
            },
            next: false,
          });
        }}
      >
        Scan
      </Button>
    </Container>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mapStateToProps = (state) => ({
  tableName: state.table.tableName,
  keys: state.table.keys,
  tables: state.profile.tables,
  query: state.query.query,
  queryGenerated: state.queryGenerator.query,
  loading: state.query.loading,
});

const mapDispatchToProps = {
  queryData: queryDataAction,
  scanData: scanDataAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlBar);
