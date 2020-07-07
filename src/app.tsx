import React, { useEffect, useState } from 'react';
import { connect, Provider } from 'react-redux';
import ReactDom from 'react-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Container, Paper, Tab, Tabs, TextField } from '@material-ui/core';
import Profiles from './components/Profiles';
import Tables from './components/Tables';
import Data from './components/Data';
import QueryEditor from './components/QueryEditor';
import { loadProfiles } from './reducers/app';
import { searchTable } from './reducers/profile';
import store from './store';
import SchemaTab from './components/SchemaTab';
// Initialise dom element for react to mount
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
      marginTop: 30,
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: 0,
      marginTop: 30,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    profile: {
      color: theme.palette.primary.contrastText,
    },
  })
);

const Main = ({
  loadProfileFromFiles,
  tableName,
  queryTableName,
  isSchemaQuerying,
  isDataQuerying,
  filterTableNames,
  searchText,
}: {
  loadProfileFromFiles: () => void;
  tableName: string;
  queryTableName: string;
  isSchemaQuerying: boolean;
  isDataQuerying: boolean;
  searchText: string;
  filterTableNames: (text: string) => void;
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [tabNo, setTabNo] = useState(0);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleTabChange = (
    _event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setTabNo(newValue);
  };

  useEffect(() => {
    loadProfileFromFiles();
  });

  useEffect(() => {
    if (isDataQuerying) {
      setTabNo(1);
      return;
    }

    if (isSchemaQuerying) {
      setTabNo(0);
    }
  }, [isDataQuerying, isSchemaQuerying]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <Toolbar
          variant="dense"
          style={{ flex: 1, display: 'flex', alignItems: 'center' }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Dynectron, a futurist DynamoDB client!!!
          </Typography>
          <Container
            maxWidth={false}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Profiles className={classes.profile} />
          </Container>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <TextField
            id="searchTable"
            label="Search ..."
            onChange={(event) => {
              filterTableNames(event.target.value);
            }}
            value={searchText}
            onKeyDown={(event) => {
              if (event.keyCode === 27) {
                filterTableNames('');
              }
            }}
          />
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Tables />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
        style={{
          overflow: 'scroll',
        }}
      >
        <QueryEditor />
        <Paper square>
          <Tabs
            value={tabNo}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
            style={{ minHeight: 0 }}
          >
            <Tab
              label={`Schema${tableName ? `(${tableName})` : ''}`}
              style={{ minHeight: 0, textTransform: 'none' }}
            />
            <Tab
              label={`Data${queryTableName ? `(${queryTableName})` : ''}`}
              style={{ minHeight: 0, textTransform: 'none' }}
            />
          </Tabs>
        </Paper>
        {tabNo === 0 && <SchemaTab />}
        {tabNo === 1 && (
          <Data
            className={clsx(classes.main, {
              [classes.contentShift]: open,
            })}
          />
        )}
      </main>
    </div>
  );
};

// @ts-ignore
const mapStateToProps = (state) => ({
  tableName: state.table.tableName,
  queryTableName: state.query.tableName,
  isDataQuerying: state.query.loading,
  isSchemaQuerying: state.table.loading,
  searchText: state.profile.searchText,
});

const mapDispatchToProps = {
  loadProfileFromFiles: loadProfiles,
  filterTableNames: searchTable,
};

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  mainElement
);
