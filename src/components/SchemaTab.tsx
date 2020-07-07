import ReactJson from 'react-json-view';
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Container, Typography } from '@material-ui/core';

function SchemaTab({
  tableSchema,
  error,
  loading,
}: {
  tableSchema?: Record<string, unknown>;
  error?: string;
  loading?: boolean;
}) {
  return (
    <Container maxWidth={false}>
      {loading && _.isEmpty(tableSchema) && (
        <Typography variant="body2" gutterBottom>
          Please wait ...
        </Typography>
      )}
      {!_.isEmpty(tableSchema) && (
        <ReactJson
          src={tableSchema || {}}
          style={{
            marginTop: 3,
            fontSize: 13,
            width: '100%',
            height: '100%',
          }}
        />
      )}
      {!_.isEmpty(error) && <span>{error}</span>}
    </Container>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mapStateToProps = (state) => ({
  tableSchema: state.table.tableSchema,
  loading: state.table.loading,
  error: state.table.error,
});

export default connect(mapStateToProps, null)(SchemaTab);
