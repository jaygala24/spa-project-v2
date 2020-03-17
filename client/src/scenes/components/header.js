import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { NavLink } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Menu from '@material-ui/core/Menu';

const innerTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#bbe4ff',
    },
    secondary: {
      main: '#fff',
    },
  },
});

class Header extends Component {
  state = {
    auth: true,
    open: false,
    anchorEl: null,
  };

  styles = {
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: 40,
    },
    title: {
      flexGrow: 1,
      fontFamily: 'Nunito',
      letterSpacing: 4,
    },
    link: {
      color: 'black',
      textDecoration: 'none',
    },
  };

  handleMenu = event => {
    this.setState({ open: !this.state.open });
  };

  handleBack = () => {
    window.history.back(1);
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleProfileMenuClose = event => {
    this.setState({ anchorEl: null });
  };

  logout = () => {
    this.setState({ anchorEl: null });
    localStorage.clear();
    document.location.reload();
  };

  render() {
    const { auth, open, anchorEl } = this.state;

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id="primary-search-account-menu"
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={this.handleProfileMenuClose}
      >
        <NavLink style={this.styles.link} to="change-password">
          <MenuItem
            style={{ fontFamily: 'Nunito', letterSpacing: 1 }}
          >
            Change Password
          </MenuItem>
        </NavLink>
        <MenuItem
          onClick={this.logout}
          style={{ fontFamily: 'Nunito', letterSpacing: 1 }}
        >
          Log out
        </MenuItem>
      </Menu>
    );

    return (
      <React.Fragment>
        <div style={this.styles.root}>
          <ThemeProvider theme={innerTheme}>
            <AppBar
              style={{ boxShadow: '0 3px 20px 0 rgba(0,0,0,.1)' }}
              position="sticky"
              color="secondary"
            >
              <Toolbar>
                <IconButton
                  onClick={this.handleBack}
                  edge="start"
                  style={this.styles.menuButton}
                  color="inherit"
                  aria-label="menu"
                >
                  {this.props.home ? '' : <ArrowBackIcon />}
                </IconButton>
                <Typography variant="h6" style={this.styles.title}>
                  <a
                    style={{ textDecoration: 'none' }}
                    href="/manage"
                  >
                    Computer Engineering Exam Portal
                  </a>
                </Typography>
                {auth && (
                  <React.Fragment>
                    <div
                      style={{
                        fontFamily: 'Nunito',
                        letterSpacing: 2,
                      }}
                    >
                      {localStorage.getItem('sapId')
                        ? localStorage.getItem('sapId')
                        : ''}
                    </div>
                    <div>
                      <IconButton
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        onClick={this.handleProfileMenuOpen}
                        color="inherit"
                      >
                        <AccountCircle />
                      </IconButton>
                    </div>
                  </React.Fragment>
                )}
              </Toolbar>
            </AppBar>
          </ThemeProvider>
          {renderMenu}
          <Drawer variant="persistent" anchor="left" open={open}>
            <div style={{ width: 240 }}>
              <IconButton onClick={this.handleMenu}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              {['Home'].map((text, index) => (
                <NavLink
                  style={{ textDecoration: 'none', color: '#000' }}
                  to="/"
                  key={index}
                >
                  <ListItem button key={text}>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                </NavLink>
              ))}
            </List>
          </Drawer>
        </div>
      </React.Fragment>
    );
  }
}

export default Header;
