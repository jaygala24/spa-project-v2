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

class CreateTeacherUser extends Component {
  state = {
    sapId: '',
    password: '',
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

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  logout = () => {
    localStorage.clear();
    document.location.reload();
  };

  componentWillMount = () => {
    setTimeout(() => {
      this.setState({ in: true });
    }, 100);
  };

  changePassword = () => {
    const { sapId, password } = this.state;

    if (!sapId || !password) {
      alert('Please fill all the details');
    }

    Axios.post(
      '/api/users/teachers/create',
      {
        sapId: sapId,
        password,
      },
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      },
    )
      .then(res => {
        alert('User added successfully');
        this.props.history.push('/manage');
      })
      .catch(err => {
        alert(err.response.data.error.msg);
      });
  };

  render() {
    const { sapId, password } = this.state;

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
                    style={this.styles.inp}
                    onChange={this.handleChange}
                    name="sapId"
                    value={sapId}
                    placeholder="SAP ID"
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
                    onChange={this.handleChange}
                    name="password"
                    value={password}
                    placeholder="Password"
                  />
                </Zoom>
                <Zoom in={true} style={{ transitionDelay: '250ms' }}>
                  <Button
                    onClick={this.changePassword}
                    color="primary"
                    variant="contained"
                    style={this.styles.btn}
                  >
                    Add
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

export default CreateTeacherUser;
