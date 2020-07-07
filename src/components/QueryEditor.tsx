import React, { useState } from 'react';

import { Container, Paper, Tab, Tabs } from '@material-ui/core';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-prompt';
import 'ace-builds/src-noconflict/ext-settings_menu';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/ext-error_marker';
import 'ace-builds/src-noconflict/ext-language_tools';
import { connect } from 'react-redux';
import { updateQuery as updateQueryAction } from '../reducers/query';
import QueryBuilder from './QueryBuilder';
import ControlBar from './ControlBar';

function QueryEditor({
  query,
  updateQuery,
}: {
  query?: string;
  updateQuery: (query: string) => void;
}) {
  const [tabNo, setTabNo] = useState(0);

  const handleTabChange = (
    _event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setTabNo(newValue);
  };

  return (
    <>
      {/* {expanded && ( */}
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          width: '100%',
        }}
        maxWidth={false}
      >
        <Paper square>
          <Tabs
            value={tabNo}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
            style={{ minHeight: 0 }}
          >
            <Tab
              label="Simple"
              style={{ minHeight: 0, textTransform: 'none' }}
            />
            <Tab label="Code" style={{ minHeight: 0, textTransform: 'none' }} />
          </Tabs>
        </Paper>
        {tabNo === 0 && <QueryBuilder />}
        {tabNo === 1 && (
          <AceEditor
            mode="json5"
            theme="monokai"
            name="queryEditor"
            onChange={(value) => {
              updateQuery(value);
            }}
            fontSize={12}
            showPrintMargin
            showGutter
            highlightActiveLine
            value={query}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            style={{
              height: 'calc(100vh - 250px)',
              width: '100%',
              maxHeight: 400,
            }}
          />
        )}
        <ControlBar tabNo={tabNo} />
      </Container>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mapStateToProps = (state) => ({
  query: state.query.query,
});

const mapDispatchToProps = {
  updateQuery: updateQueryAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryEditor);
