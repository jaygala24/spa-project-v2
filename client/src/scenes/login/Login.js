import React, { Component } from 'react';
import {
  Grid,
  Paper,
  Button,
  InputBase,
  Zoom,
  Slide,
  Fade,
} from '@material-ui/core';
import Axios from 'axios';
import auth from './auth';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Unicode from './unicode.png';

class Login extends Component {
  state = {
    showPassword: false,
    username: '',
    password: '',
  };

  styles = {
    card: {
      background: '#fff',
      padding: 40,
      borderRadius: 20,
      boxShadow: '0 3px 20px 0 rgba(0,0,0,.1)',
    },
    btn: {
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
      background: '#fff',
      padding: '16px 24px',
      borderRadius: 16,
      boxShadow: '0 5px 30px 0 #d2d2d270',
      width: '100%',
      fontFamily: 'Nunito',
    },
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { username, password } = this.state;

    // Validation for empty fields
    if (!username && !password) {
      alert('Please fill all the fields');
    }

    Axios.post('/api/auth/users/login', {
      sapId: username,
      password: password,
    })
      .then(res => {
        // Storing the necessary details in the local storage
        if (res.data.data.token) {
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('sapId', res.data.data.user.sapId);
          localStorage.setItem(
            'admin',
            res.data.data.user.admin ? true : false,
          );
          localStorage.setItem('id', res.data.data.user._id);
          auth.login();
          this.props.history.push('/manage');
        }
      })
      .catch(err => {
        // Error msg alert
        alert(err.response.data.error.msg);
      });
  };

  componentDidMount() {
    if (auth.isAuthenticated()) {
      // If token exists then redirect to dashboard
      this.props.history.push('/manage');
    } else {
      auth.logout();
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            background: '#deffe1',
          }}
        >
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="baseline"
            style={{ width: '100vw', height: '80vh' }}
          >
            <Grid item xs={12}></Grid>
            <Grid
              item
              style={{
                fontFamily: 'Nunito',
                letterSpacing: 4,
                fontSize: 28,
                color: '#717171',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  letterSpacing: 4,
                  color: '#717171',
                }}
              >
                Computer Programming
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: '#717171',
                  letterSpacing: 4,
                  textAlign: 'center',
                }}
              >
                Dwarkadas J. Sanghvi College of Engineering
              </div>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={3} md={5} lg={4}>
              <Slide in={true} direction="up">
                <Paper style={this.styles.card}>
                  <Grid container direction="row" justify="center">
                    <Grid
                      item
                      style={{
                        fontFamily: 'Nunito',
                        letterSpacing: 2,
                        fontSize: 28,
                        color: '#717171',
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 20,
                          textAlign: 'center',
                          color: '#464646b0',
                          letterSpacing: 18,
                        }}
                      >
                        LOGIN
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{
                        padding: 14,
                        fontFamily: 'Nunito',
                        letterSpacing: 1,
                      }}
                    >
                      <Zoom
                        in={true}
                        style={{ transitionDelay: '100ms' }}
                      >
                        <InputBase
                          name="username"
                          value={this.state.username}
                          onChange={this.handleChange}
                          placeholder="SAP ID"
                          style={this.styles.inp}
                        />
                      </Zoom>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{
                        padding: 14,
                        fontFamily: 'Nunito',
                        letterSpacing: 1,
                      }}
                    >
                      <Zoom
                        in={true}
                        style={{ transitionDelay: '200ms' }}
                      >
                        <InputBase
                          name="password"
                          value={this.state.password}
                          onChange={this.handleChange}
                          placeholder="Password"
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
                            this.state.showPassword
                              ? 'text'
                              : 'password'
                          }
                          style={this.styles.inp}
                        />
                      </Zoom>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{
                        padding: 14,
                        fontFamily: 'Nunito',
                        letterSpacing: 1,
                      }}
                    >
                      <Zoom
                        in={true}
                        style={{ transitionDelay: '300ms' }}
                      >
                        <Button
                          onClick={this.handleSubmit}
                          style={this.styles.btn}
                          variant="contained"
                        >
                          Sign In
                        </Button>
                      </Zoom>
                    </Grid>
                  </Grid>
                </Paper>
              </Slide>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item style={{ opacity: '0.6' }}>
              <Fade
                in={true}
                style={{
                  transitionDelay: '800ms',
                  transitionDuration: '1500ms',
                }}
              >
                <img src={Unicode} alt="unicode-logo" />
              </Fade>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
