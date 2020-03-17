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

import Axios from 'axios';

class CreateStudentUser extends Component {
  state = {
    div: '',
    sapId: '',
    batch: '',
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

  componentWillMount = () => {
    setTimeout(() => {
      const year = new Date().getFullYear();
      this.setState({ in: true, batch: year });
    }, 100);
  };

  // Api handler for the create student
  addStudent = () => {
    const { sapId, div, batch } = this.state;

    if (!sapId || !div || !batch) {
      alert('Please fill all the details');
    }

    Axios.post(
      '/api/users/students/create',
      {
        sapId,
        div: div[0].toUpperCase() + div.slice(1),
        year: batch,
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
    const { sapId, div, batch } = this.state;

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
                    name="sapId"
                    value={sapId}
                    onChange={this.handleChange}
                    placeholder="SAP ID"
                  />
                </Zoom>
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                  <InputBase
                    style={this.styles.inp}
                    name="div"
                    value={div}
                    onChange={this.handleChange}
                    placeholder="Division"
                  />
                </Zoom>
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                  <InputBase
                    style={this.styles.inp}
                    name="batch"
                    value={batch}
                    type="number"
                    onChange={this.handleChange}
                    placeholder="Batch"
                  />
                </Zoom>
                <Zoom in={true} style={{ transitionDelay: '250ms' }}>
                  <Button
                    onClick={this.addStudent}
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

export default CreateStudentUser;
