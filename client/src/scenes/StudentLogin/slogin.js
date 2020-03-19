import React, { Component } from 'react';
import {
  Grid,
  Paper,
  Button,
  Typography,
  IconButton,
  InputBase,
  Zoom,
  Slide,
} from '@material-ui/core';
import Axios from 'axios';
import auth from '../login/auth';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';

class SLogin extends Component {
  state = {
    showPassword: false
  };
  styles = {
    card: {
      padding: 40,
      boxShadow: '2px 2px 25px #c6d1e8',
      borderRadius: 8,
    },
    btn: {
      width: '100%',
      boxShadow: 'none',
      background: '#3bacd7',
      color: 'white',
      padding: '12px 0px',
      fontFamily: 'Nunito',
      letterSpacing: 1,
    },
    font: {
      fontFamily: 'Nunito',
      color: '#797979',
      marginBottom: 10,
      letterSpacing: 1,
    },
    btn1: {
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
  ValidateEmail = mail => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  };
  handleUsername = event => {
    this.setState({ username: event.target.value });
  };
  handlePassword = event => {
    this.setState({ password: event.target.value });
  };
  handleSetName = event => {
    this.setState({ set: event.target.value.toUpperCase().trim() });
  };
  handleDivision = event => {
    this.setState({ division: event.target.value.toUpperCase() });
  };
  handleEmailId = event => {
    this.setState({ email: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    if (
      this.state.username &&
      this.state.password
    ) {
      Axios.post('/api/auth/users/login', {
        sapId: this.state.username,
        password: this.state.password
      }).then(
        res => {
          console.log(res.data.data);
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('sapId', res.data.data.user.sapId);
          localStorage.setItem('studentId', res.data.data.user._id);
          localStorage.setItem('id', res.data.data.user._id);
          window.location='/enter-set'
        },
        err => {
          alert(err.response.data.error.msg);
        },
      );
    } else {
      alert('Invalid Input');
    }
  };
  handleShow = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  componentDidMount() {
    localStorage.removeItem('token');
    // localStorage.removeItem('sapId');
    localStorage.removeItem('id');
    localStorage.removeItem('admin');
    auth.logout();
  }
  render() {
    console.log(this.state);
    return (
      <React.Fragment>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            // backgroundSize: 'cover',
            // backgroundImage: `url(${Image})`,
            // backgroundRepeat: 'no-repeat'
            background: '#f2fffe',
          }}
        >
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
            style={{ width: '80vw', height: '100vh', margin: 'auto' }}
            spacing={4}
          >
            {/* <Grid item xs={12}></Grid> */}
            {/* <Grid item xs={12}></Grid> */}
            <Grid item md={6} lg={5} xl={4}>
              {/* <Paper style={this.styles.card} > */}
              <Grid container direction="row" justify="center">
                <Grid
                  item
                  style={{
                    fontFamily: 'Nunito',
                    letterSpacing: 2,
                    fontSize: 22,
                    color: '#717171',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    Computer Programming
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: '#717171',
                      textAlign: 'center',
                      marginBottom: 40,
                    }}
                  >
                    Dwarkadas J. Sanghvi College of Engineering
                  </div>
                </Grid>
                {/* <Grid item xs={12} >
                                        <Typography align='center' variant='h5' style={{color: '#3bacd7', fontFamily: 'Nunito', letterSpacing: 4}} >LOGIN</Typography>
                                    </Grid> */}
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
                      onChange={this.handleUsername}
                      fullWidth
                      id="standard-basic"
                      style={this.styles.inp}
                      placeholder="SAP ID"
                      autoComplete="off"
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
                    style={{ transitionDelay: '150ms' }}
                  >
                    <InputBase
                      onChange={this.handlePassword}
                      type={
                        this.state.showPassword ? 'text' : 'password'
                      }
                      fullWidth
                      id="standard-basic"
                      placeholder="Password"
                      autoComplete="off"
                      style={this.styles.inp}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={this.handleShow}
                          >
                            {this.state.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </Zoom>
                </Grid>
                {/* <Grid
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
                      onChange={this.handleSetName}
                      fullWidth
                      id="standard-basic"
                      placeholder="Set Name"
                      autoComplete="off"
                      style={this.styles.inp}
                    />
                  </Zoom>
                </Grid> */}
                {/* <Grid
                  item
                  xs={12}
                  style={{
                    padding: 14,
                    fontFamily: 'Nunito',
                    letterSpacing: 1,
                  }}
                >
                  <Zoom in={true} style={{transitionDelay: '200ms'}} >
                    <InputBase
                      onChange={this.handleDivision}
                      fullWidth
                      id="standard-basic"
                      placeholder="Division"
                      autoComplete="off"
                      style={this.styles.inp}
                    />
                  </Zoom>
                </Grid> */}
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
                    style={{ transitionDelay: '250ms' }}
                  >
                    <Button
                      onClick={this.handleSubmit}
                      style={this.styles.btn1}
                      variant="contained"
                    >
                      Start test
                    </Button>
                  </Zoom>
                </Grid>
              </Grid>
              {/* </Paper> */}
            </Grid>
            <Grid item md={6} lg={6} xl={5}>
              <Slide
                in={true}
                direction="up"
                style={{ transitionDelay: '350ms' }}
              >
                <Paper style={this.styles.card}>
                  <Typography variant="h6" style={this.styles.font}>
                    Instructions
                  </Typography>
                  <Typography style={this.styles.font}>
                    1. After proceeding to Section B, students cannot
                    modify the answers of sevtion A
                  </Typography>
                  <Typography style={this.styles.font}>
                    2. Students are not supposed to close/minimize the
                    exam portal during the test. If done so the
                    student will not be allowed to reappear for the
                    test
                  </Typography>
                  <Typography style={this.styles.font}>
                    3. The usage of following keys is prohibited:{' '}
                    <br /> - Windows Key <br /> - Alt Key
                  </Typography>
                  <Typography style={this.styles.font}>
                    4. The test uses GCC compiler and thus usage of
                    'conio.h' header file is invalid
                  </Typography>
                  <Typography style={this.styles.font}>
                    5. In section B the code should not contain the
                    character '$' anywhere in the code
                  </Typography>
                  <Typography style={this.styles.font}>
                    6. Students are supposed to run their code before
                    submission
                  </Typography>
                  <Typography style={this.styles.font}>
                    7. If the timer expires before the submition of
                    the test, the section which is submitted will only
                    be considered
                  </Typography>
                  <Typography style={this.styles.font}>
                    8. After completion and submission of the test,
                    the students should not exit the portal
                  </Typography>
                  <Typography style={this.styles.font}>
                    printf("ALL THE BEST");
                  </Typography>
                </Paper>
              </Slide>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default SLogin;
