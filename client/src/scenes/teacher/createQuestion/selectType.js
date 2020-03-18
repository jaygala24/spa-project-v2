import React, { Component } from 'react';
import Header from '../../components/header';
import Card from '../home/Card';
import { Grid, Paper } from '@material-ui/core';

class SelectType extends Component {
  state = {};
  styles = {
    card: {
      padding: 120,
      fontFamily: 'Nunito',
      fontSize: 34,
      letterSpacing: 6,
      color: '#797979',
      boxShadow: '#c6e0e4 2px 2px 14px',
      borderRadius: 10,
    },
    font: {
      fontFamily: 'Nunito',
      fontSize: 28,
      letterSpacing: 6,
      color: '#797979',
    },
  };
  render() {
    return (
      <React.Fragment>
        <Header />
        <Grid
          style={{ background: '#f3faff', height: '100vh' }}
          container
          direction="row"
          justify="center"
        >
          <Grid item xs={10}>
            <Grid
              style={{ marginTop: 40 }}
              spacing={4}
              container
              direction="row"
              justify="center"
            >
              <Grid item xs={12}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{ ...this.styles.font, marginBottom: 40 }}
                  >
                    Select Type of question
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Card
                  text="MCQ"
                  link="create-mcq"
                  delay={{ transitionDelay: '100ms' }}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Card
                  text="Code"
                  link="create-code"
                  delay={{ transitionDelay: '100ms' }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default SelectType;
