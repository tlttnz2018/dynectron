/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { clipboard } from 'electron';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import {
  queryData as queryDataAction,
  scanData as scanDataAction,
  toggleColumnVisible as toggleColumnVisibleAction,
  toggleAllColumnVisible as toggleAllColumnVisibleAction,
} from '../reducers/query';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

function Data({
  className,
  tableName,
  columnHeaders,
  loading,
  data,
  count,
  total,
  totalScanned,
  error,
  isScan,
  hasMore,
  queryNextData,
  scanNextData,
  toggleColumnVisible,
  toggleAllColumnVisible,
}: {
  className?: string;
  tableName: string;
  columnHeaders: ColDef[];
  loading: boolean;
  data?: Record<string, unknown>[];
  count: number;
  total: number;
  totalScanned: number;
  error?: string;
  isScan: boolean;
  hasMore: boolean;
  queryNextData: ({ name, next }: { name: string; next: boolean }) => void;
  scanNextData: ({
    conditions,
    next,
  }: {
    conditions: Record<string, unknown>;
    next: boolean;
  }) => void;
  toggleColumnVisible: ({ index }: { index: number }) => void;
  toggleAllColumnVisible: (checked: boolean) => void;
}) {
  const bottomRef = useRef(null);
  const [item, setItem] = useState({});
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();

  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const handleMenuClick = (event: unknown) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let dataDisplay: Record<string, unknown>[] | undefined;
  if (_.isEmpty(data) && count > 0) {
    dataDisplay = [{ count }];
  } else {
    dataDisplay = data;
  }

  const numberOfCheckedColumns = columnHeaders.filter(
    (columnHeaders) => !columnHeaders.hide
  ).length;
  return (
    <>
      {error && (
        <span>
          Loading data error:
          {error}
        </span>
      )}
      {loading && _.isEmpty(dataDisplay) && (
        <Typography variant="body2" gutterBottom>
          Please wait ...
        </Typography>
      )}
      {!_.isEmpty(dataDisplay) && (
        <div
          className={className}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyItems: 'center',
            marginTop: 5,
            padding: 0,
          }}
        >
          <Container
            maxWidth={false}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 0,
              marginBottom: 3,
            }}
          >
            {loading && (
              <Typography
                variant="body2"
                gutterBottom
                style={{ marginRight: 10, justifySelf: 'flex-start' }}
              >
                Please wait ...
              </Typography>
            )}
            <Typography
              variant="body2"
              gutterBottom
              style={{ marginRight: 10 }}
            >
              {total !== totalScanned
                ? `${total} rows / ${totalScanned} scanned`
                : `${total} rows`}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                if (isScan) {
                  scanNextData({
                    conditions: {
                      tableName,
                    },
                    next: true,
                  });
                } else {
                  queryNextData({
                    name: tableName,
                    next: true,
                  });
                }
              }}
              disabled={!hasMore || loading}
            >
              More
            </Button>
            <Button
              size="small"
              variant="outlined"
              style={{ marginLeft: 5 }}
              onClick={handleMenuClick}
            >
              Columns
            </Button>
            <Menu
              id="filter-column-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem key={`menu-all`}>
                <Checkbox
                  color="primary"
                  size="small"
                  onChange={(_event, checked) => {
                    toggleAllColumnVisible(checked);
                  }}
                  checked={numberOfCheckedColumns === columnHeaders.length}
                  indeterminate={
                    numberOfCheckedColumns !== columnHeaders.length &&
                    numberOfCheckedColumns > 0
                  }
                  disabled={columnHeaders.length === 0}
                />
                All
              </MenuItem>
              <Divider />
              {columnHeaders.map((column: ColDef, index) => {
                return (
                  <MenuItem key={`menu-${column.headerName}`}>
                    <Checkbox
                      color="primary"
                      size="small"
                      checked={!column.hide}
                      onChange={() => {
                        toggleColumnVisible({
                          index,
                        });
                      }}
                    />
                    {column.headerName}
                  </MenuItem>
                );
              })}
            </Menu>
          </Container>
          <div
            className="ag-theme-alpine"
            style={{
              flex: 1,
              width: '100%',
              height: `calc(100vh - 150px)`,
              maxHeight: `calc(100vh - 150px)`,
            }}
          >
            <AgGridReact
              columnDefs={columnHeaders}
              rowData={dataDisplay}
              suppressCellSelection
              onRowClicked={(event) => {
                setItem(event.data);
                handleOpen();
              }}
              defaultColDef={{
                sortable: true,
                resizable: true,
                filter: true,
                valueFormatter: (params) => {
                  const { value } = params;
                  return _.isString(value)
                    ? value
                    : JSON.stringify(params.value);
                },
                filterValueGetter: (params) => {
                  const { data: rowData } = params;
                  const value = rowData[params.column.getColId()];
                  if (typeof value === 'object') {
                    return JSON.stringify(value);
                  }
                  return value;
                },
                filterParams: {
                  buttons: ['reset'],
                  closeOnApply: true,
                },
              }}
            />
          </div>
          <div ref={bottomRef} />
        </div>
      )}
      {open && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h2
                id="transition-modal-title"
                style={{ marginTop: 0, marginBottom: 16 }}
              >
                Data
              </h2>
              <ReactJson
                src={item}
                style={{
                  fontSize: 13,
                  width: 600,
                  height: 400,
                  overflow: 'scroll',
                }}
                enableClipboard={(copy) => {
                  clipboard.writeText(JSON.stringify(copy.src));
                }}
              />
            </div>
          </Fade>
        </Modal>
      )}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mapStateToProps = (state) => ({
  data: state.query.data,
  error: state.query.error,
  tableName: state.query.tableName,
  isScan: state.query.isScan,
  hasMore: state.query.hasMore,
  count: state.query.count,
  total: state.query.total,
  loading: state.query.loading,
  totalScanned: state.query.totalScanned,
  columnHeaders: state.query.columnHeaders,
});

const mapDispatchToProps = {
  queryNextData: queryDataAction,
  scanNextData: scanDataAction,
  toggleColumnVisible: toggleColumnVisibleAction,
  toggleAllColumnVisible: toggleAllColumnVisibleAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Data);
