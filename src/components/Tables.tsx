import React from 'react';
import _ from 'lodash';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { createStyles, List, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { selectTable as selectTableAction } from '../reducers/table';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  })
);

function Tables({
  selectTable,
  tables,
  error,
  loading,
}: {
  selectTable: (table: string) => void;
  tables: string[];
  error: string;
  loading: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const classes = useStyles();

  return (
    <>
      {loading && _.isEmpty(tables) && (
        <Typography variant="body2" gutterBottom>
          Please wait ...
        </Typography>
      )}
      {error && <span>{error}</span>}
      {!_.isEmpty(tables) && (
        <List className={classes.root}>
          {tables &&
            tables.map((table, index) => {
              return (
                <ListItem
                  button
                  selected={selectedIndex === index}
                  key={table}
                  onClick={() => {
                    selectTable(table);
                    setSelectedIndex(index);
                  }}
                >
                  <ListItemText primary={table} key={table} />
                </ListItem>
              );
            })}
        </List>
      )}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mapStateToProps = (state) => ({
  tables: state.profile.tables,
  loading: state.profile.loading,
  error: state.profile.error,
});

const mapDispatchToProps = {
  selectTable: selectTableAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
