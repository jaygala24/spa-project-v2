import React, { Component } from 'react';
import Header from '../../components/header';
import {
  Grid,
  InputBase,
  Paper,
  IconButton,
  Zoom,
  Button,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import NotFound from './no-results.png';
import Axios from 'axios';

class LoggedInList extends Component {
  state = {
    students: [],
    filter: [],
    count: 0,
    search: '',
  };

  styles = {
    card: {
      background: '#fff',
      padding: 30,
      marginBottom: 20,
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
    btn1: {
      margin: '5px 10px 0px 0px',
      background: '#6fdcf5',
      color: 'white',
      padding: '10px 12px',
      fontFamily: 'Nunito',
      letterSpacing: 1,
      borderRadius: 10,
      boxShadow: '0 5px 16px 0 #6fdcf5',
    },
    inp: {
      background: '#fff',
      padding: '10px 24px',
      borderRadius: 16,
      boxShadow: '0 5px 30px 0 #d2d2d270',
      fontFamily: 'Nunito',
      marginBottom: 10,
      marginTop: 40,
    },
    link: {
      textDecoration: 'none',
      cursor: 'pointer',
    },
  };

  // Reset single user login
  handleReset = sapId => {
    Axios.get(`/api/students/resetLogin?sapId=${sapId}`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }).then(res => {
      this.getAllLoggedInStudents();
    });
  };

  // Reset all user login
  handleResetAll = () => {
    Axios.get(`/api/students/resetLogin`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }).then(res => {
      this.getAllLoggedInStudents();
    });
  };

  // Search result for matches
  search = event => {
    const sapId = event.target.value;
    const { students } = this.state;
    let filter = [];

    if (sapId === '') {
      // No search then defaults to all students
      filter = students;
    } else {
      // Search then defaults to only matched students
      students.forEach(s => {
        if (s.sapId.match(sapId)) {
          filter.push(s);
        }
      });
    }

    this.setState({ search: sapId, filter: filter });
  };

  // Api handler for get all loggedin students
  getAllLoggedInStudents = () => {
    Axios.get(`/api/students/loggedIn`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }).then(res => {
      this.setState({
        count: res.data.data.count,
        students: res.data.data.students,
        filter: res.data.data.students,
      });
    });
  };

  componentDidMount() {
    this.getAllLoggedInStudents();
  }

  render() {
    const { filter, search, count } = this.state;

    var delay = -50;

    const renderCard = filter.map(s => {
      delay = delay + 50;
      return (
        <Grid item xs={12} key={s.sapId}>
          <Zoom in={true} style={{ transitionDelay: `${delay}ms` }}>
            <Paper style={this.styles.card}>
              <div style={{ display: 'flex' }}>
                <div>{s.sapId}</div>
                <div style={{ flexGrow: 1 }}></div>
                <Button
                  onClick={() => this.handleReset(s.sapId)}
                  variant="outlined"
                >
                  RESET
                </Button>
              </div>
            </Paper>
          </Zoom>
        </Grid>
      );
    });

    return (
      <React.Fragment>
        <Header />
        <Grid container direction="row" justify="center">
          <Grid item xs={10}>
            <Grid
              container
              direction="row"
              justify="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <Paper style={this.styles.inp}>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                  <InputBase
                    value={search}
                    style={{ width: '60%' }}
                    placeholder="Search SAP ID"
                    onChange={this.search}
                  />
                </Paper>
              </Grid>
              <Grid item xs={7}>
                <Paper
                  style={{
                    ...this.styles.inp,
                    marginTop: 0,
                    marginBottom: 40,
                  }}
                >
                  <Typography variant="h6">
                    Students Loggedin : {count}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Button
                  onClick={this.handleResetAll}
                  style={this.styles.btn1}
                >
                  RESET ALL
                </Button>
              </Grid>
              {filter.length > 0 ? renderCard : (
                <img src={NotFound} alt="No Results found"/>
              )}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default LoggedInList;
