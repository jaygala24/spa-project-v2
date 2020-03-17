import React, { Component } from 'react';
import Header from '../components/header';
import {
  Grid,
  Paper,
  Button,
  InputBase,
  Collapse,
  Zoom,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Axios from 'axios';

class ChangePassword extends Component {
  state = {
    pass: '',
    confpass: '',
    showPassword: false,
    in: false,
  };

  styles = {
    card: {
      padding: 40,
      background: '#fff',
      borderRadius: 20,
      boxShadow: '0 3px 20px 0 rgba(0,0,0,.1)',
    },
    btn: {
      marginTop: 40,
      width: '100%',
      background: '#62ce97',
      color: 'white',
      padding: '12px 0px',
      fontFamily: 'Nunito',
      letterSpacing: 1,
      borderRadius: 10,
      boxShadow: '0 5px 30px 0 #62ce97',
    },
    inp: {
      margin: '10px 0px',
      background: '#fff',
      padding: '16px 24px',
      borderRadius: 16,
      boxShadow: '0 5px 30px 0 #d2d2d270',
      width: '100%',
      fontFamily: 'Nunito',
    },
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  logout = () => {
    localStorage.clear();
    document.location.reload();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  componentWillMount = () => {
    setTimeout(() => {
      this.setState({ in: true });
    }, 100);
  };

  changePassword = () => {
    const { pass, confpass } = this.state;

    if (pass !== confpass || !pass) {
      alert('Passwords do not match');
    }

    Axios.put(
      '/api/auth/users/password',
      {
        password: pass,
      },
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      },
    ).then(res => {
      alert('Password changed successfully');
      this.logout();
    });
  };

  render() {
    return (
      <React.Fragment>
        <Header />
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={{ width: '100vw', height: '80vh' }}
        >
          <Grid item xs={4} md={5} lg={3}>
            <Collapse
              in={this.state.in}
              style={{ transitionDelay: '100ms' }}
            >
              <Paper style={this.styles.card}>
                <Zoom in={true} style={{ transitionDelay: '150ms' }}>
                  <InputBase
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          edge="end"
                        >
                          {this.state.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    type={
                      this.state.showPassword ? 'text' : 'password'
                    }
                    style={this.styles.inp}
                    name="pass"
                    onChange={this.handleChange}
                    placeholder="New Password"
                  />
                </Zoom>
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                  <InputBase
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          edge="end"
                        >
                          {this.state.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    type={
                      this.state.showPassword ? 'text' : 'password'
                    }
                    style={this.styles.inp}
                    name="confpass"
                    onChange={this.handleChange}
                    placeholder="Confirm password"
                  />
                </Zoom>

                <Zoom in={true} style={{ transitionDelay: '250ms' }}>
                  <Button
                    onClick={this.changePassword}
                    color="primary"
                    variant="contained"
                    style={this.styles.btn}
                  >
                    Change
                  </Button>
                </Zoom>
              </Paper>
            </Collapse>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ChangePassword;
