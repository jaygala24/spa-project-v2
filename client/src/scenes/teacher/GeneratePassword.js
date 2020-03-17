import React, { Component } from 'react';
import Header from '../components/header';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Grow,
} from '@material-ui/core';
import Axios from 'axios';
import Alert from '../components/alert';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

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

class Generate extends Component {
  state = {
    password: '',
    time: '',
    date: '',
    open: false,
    in: true,
  };

  styles = {
    card: {
      padding: 80,
      fontFamily: 'Nunito',
      fontSize: 28,
      letterSpacing: 6,
      color: '#797979',
      boxShadow: '0 3px 20px 0 rgba(0,0,0,.1)',
      borderRadius: 10,
    },
    btn: {
      width: '100%',
      background: '#6fdcf5',
      color: 'white',
      padding: '12px 0px',
      fontFamily: 'Nunito',
      letterSpacing: 1,
      borderRadius: 10,
      boxShadow: '0 5px 30px 0 #6fdcf5',
    },
  };

  openAlert = () => {
    this.setState({ open: true });
  };

  updateGen = () => {
    this.setState({ in: false });
    setTimeout(() => {
      this.generatePasssword();
    }, 500);
  };

  generatePasssword = () => {
    const today = new Date();

    const date =
      today.getDate() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getFullYear();

    const time =
      today.getHours() +
      ':' +
      today.getMinutes() +
      ':' +
      today.getSeconds();

    Axios.get('/api/students/changePassword', {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => {
        localStorage.setItem('pass', res.data.data.password);
        localStorage.setItem('time', time);
        localStorage.setItem('date', date);

        this.setState({
          password: res.data.data.password,
          time: time,
          date: date,
          open: false,
          in: true,
        });
      })
      .catch(err => {
        alert(err.response.data.error.msg);
      });
  };
  render() {
    return (
      <React.Fragment>
        <Header />
        <ThemeProvider theme={innerTheme}>
          <Alert
            open={this.state.open}
            title=""
            message="Are you sure you want to generate a new password?"
            affirmative="Yes"
            negative="No"
            callback={this.updateGen}
          />
          <Grid container direction="row" justify="center">
            <Grid item xs={10} lg={8}>
              <Grid
                container
                direction="row"
                justify="center"
                spacing={1}
                style={{ marginTop: 40 }}
              >
                <Grid item xs={12} lg={10}>
                  <Grow in={this.state.in}>
                    <Paper style={this.styles.card}>
                      <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        spacing={1}
                      >
                        <Grid item xs={7}>
                          <Typography
                            style={{
                              fontSize: 18,
                              fontFamily: 'Nunito',
                              letterSpacing: 1,
                            }}
                            variant="overline"
                          >
                            Time created :{' '}
                            {this.state.time ||
                              localStorage.getItem('time') ||
                              ''}{' '}
                            {this.state.date ||
                              localStorage.getItem('date') ||
                              ''}
                          </Typography>
                          <br />
                          <Typography
                            style={{
                              fontSize: 18,
                              fontFamily: 'Nunito',
                              letterSpacing: 1,
                            }}
                            variant="overline"
                          >
                            Created by : 90004170050
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography
                            style={{
                              fontFamily: 'Nunito',
                              letterSpacing: 1,
                            }}
                            variant="h6"
                          >
                            Password
                          </Typography>
                          <Typography
                            style={{
                              fontFamily: 'Nunito',
                              letterSpacing: 2,
                            }}
                            variant="h2"
                          >
                            {this.state.password
                              ? this.state.password
                              : localStorage.getItem('pass') ||
                                '----'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grow>
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={2}>
                  <Button
                    onClick={this.openAlert}
                    color="primary"
                    style={this.styles.btn}
                    variant="contained"
                  >
                    Generate
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default Generate;
