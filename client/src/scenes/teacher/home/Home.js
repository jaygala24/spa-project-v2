import React, { Component } from 'react';
import Header from '../../components/header';
import { Grid } from '@material-ui/core';
import Card from './Card';

class HomeTeacher extends Component {
  componentDidMount(){
    document.removeEventListener("keyup",()=>true,true)
  }
  render() {
    return (
      <React.Fragment>
        <Header home={true} />
        <Grid
          container
          direction="row"
          justify="center"
          style={{ background: '#f3faff', height: '100vh' }}
        >
          <Grid item xs={10}>
            <Grid
              style={{ marginTop: 40 }}
              spacing={4}
              container
              direction="row"
              justify="center"
            >
              <Grid item xs={6} md={4} lg={3}>
                <Card
                  delay={{ transitionDelay: '50ms' }}
                  link="/create-test"
                  text="Create Test"
                />
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Card
                  delay={{ transitionDelay: '100ms' }}
                  link="/create-question"
                  text="Create Question"
                />
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Card
                  delay={{ transitionDelay: '200ms' }}
                  link="/questions"
                  text="Questions"
                />
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Card
                  delay={{ transitionDelay: '200ms' }}
                  link="/view-tests"
                  text="View Tests"
                />
              </Grid>
              {localStorage.getItem('admin') === 'true' ? (
                <Grid item xs={6} md={4} lg={3}>
                  <Card
                    delay={{ transitionDelay: '300ms' }}
                    link="/generate-password"
                    text="Start test"
                  />
                </Grid>
              ) : (
                ''
              )}
              <Grid item xs={6} md={4} lg={3}>
                <Card
                  delay={{ transitionDelay: '400ms' }}
                  link="/student-list"
                  text="Evaluate"
                />
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Card
                  delay={{ transitionDelay: '400ms' }}
                  link="/reset"
                  text="Reset"
                />
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Card
                  delay={{ transitionDelay: '400ms' }}
                  link="/add-student"
                  text="Add Student"
                />
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Card
                  delay={{ transitionDelay: '400ms' }}
                  link="/add-teacher"
                  text="Add Teacher"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default HomeTeacher;
