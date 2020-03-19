import React, { Component } from 'react';
import { Grid, Paper, Button } from '@material-ui/core';
import Header from '../../components/header';
import QuestionCard from './QuestionCard';
import Axios from 'axios';
import Alert from '../../components/alert';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Details from '../question/Details';

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

class ViewTest extends Component {
  state = {
    open: false,
    details: false,
    type: '',
    options: [],
    correctAnswer: '',
    title: '',
  };
  styles = {
    card: {
      padding: 40,
      borderRadius: 8,
      boxShadow: '0 3px 20px 0 rgba(0,0,0,.1)',
    },
    seperator: {
      padding: 10,
      borderBottom: '1px solid #a9a9a9',
    },
    type: {
      padding: 10,
    },
    total: {
      padding: 10,
      fontFamily: 'Nunito',
      letterSpacing: 2,
    },
    font: {
      fontFamily: 'Nunito',
      letterSpacing: 1,
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
  };
  componentDidMount = () => {
    if (this.props.location.idProp) {
      localStorage.setItem('paperId', this.props.location.idProp.id);
      console.log(`/api/papers/${this.props.location.idProp.id}`);
      Axios.get(`/api/papers/${this.props.location.idProp.id}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      }).then(res => this.setState({ data: res.data.data }));
    } else {
      console.log(`/api/papers/${localStorage.getItem('paperId')}`);
      Axios.get(`/api/papers/${localStorage.getItem('paperId')}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      }).then(res => this.setState({ data: res.data.data }));
    }
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  marksCalculator = () => {
    var currentObj = this.state.data;
    var mcq = 0;
    var code = 0;
    currentObj.paper.mcq.forEach(q => {
      mcq = mcq + q.marks;
    });
    currentObj.paper.code.forEach(q => {
      code = code + q.marks;
    });
    return {
      mcq: mcq,
      code: code,
      total: mcq + code,
    };
  };
  updateMarks = (type, id, marks) => {
    var currentObj = this.state.data;
    if (type === 'mcq') {
      console.log('IN');
      currentObj.paper.mcq.forEach(q => {
        if (q._id == id) {
          console.log('FOUND');
          q.marks = marks;
        }
      });
    } else {
      currentObj.paper.code.forEach(q => {
        if (q._id == id) {
          q.marks = marks;
        }
      });
    }
    this.setState({ data: currentObj });
  };
  handleDetailsClose = () => {
    this.setState({ details: false });
  };
  handleDetailsOpen = (type, opt, ca, q) => {
    this.setState({
      type: type,
      options: opt,
      correctAnswer: ca,
      title: q,
      details: true,
    });
  };
  handleUpdate = () => {
    var temp = this.state.data;
    var body = {
      set: this.state.data.paper.set,
      type: this.state.data.paper.type,
      time: this.state.data.paper.time,
      year: this.state.data.paper.year,
      mcq: [],
      code: [],
    };

    temp.paper.mcq.map(m => {
      body.mcq.push({
        questionId: m._id,
        marks: m.marks,
      });
      return true;
    });

    temp.paper.code.map(m => {
      body.code.push({
        questionId: m._id,
        marks: m.marks,
      });
      return true;
    });

    console.log({ body });

    Axios.put(
      `/api/papers/${localStorage.getItem('paperId')}`,
      body,
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      },
    ).then(this.setState({ open: true }), err => console.log(err));
  };
  render() {
    console.log(this.state.data ? this.state.data.paper : '');
    var delay = -50;
    const renderMCQQuestions = this.state.data
      ? this.state.data.paper.mcq.map(m => {
          delay = delay + 50;
          return (
            <QuestionCard
              show={() =>
                this.handleDetailsOpen(
                  m.question.type,
                  m.question.options,
                  m.question.correctAnswers[0],
                  m.question.title,
                )
              }
              font={this.styles.font}
              Disabletoggle={true}
              question={m.title}
              type={m.type}
              marks={m.marks}
              delay={{ transitionDelay: `${delay}ms` }}
              updateMarks={marks =>
                this.updateMarks('mcq', m._id, marks)
              }
            />
          );
        })
      : 'Loading....';
    const renderCodeQuestions = this.state.data
      ? this.state.data.paper.code.map(m => {
          delay = delay + 50;
          return (
            <QuestionCard
              font={this.styles.font}
              Disabletoggle={true}
              question={m.title}
              type={m.type}
              marks={m.marks}
              delay={{ transitionDelay: `${delay}ms` }}
              updateMarks={marks =>
                this.updateMarks('code', m._id, marks)
              }
            />
          );
        })
      : '';
    return (
      <React.Fragment>
        <Header />
        <Alert
          open={this.state.open}
          title="Update successful"
          message="Marks have been updated sucessfully"
          affirmative="Done"
          negative=""
          callback={this.handleClose}
        />
        <Details
          category={this.state.type}
          options={this.state.options}
          correct={this.state.correctAnswer}
          question={this.state.title}
          open={this.state.details}
          close={this.handleDetailsClose}
        />
        <Grid
          container
          direction="row"
          style={{ width: '100%', height: '90vh', margin: 0 }}
          spacing={4}
          alignItems="center"
          justify="center"
        >
          <Grid
            item
            style={{ height: '80vh', overflowY: 'scroll' }}
            xs={7}
            lg={8}
          >
            <Grid
              style={{ marginTop: 0 }}
              container
              direction="row"
              justify="center"
            >
              <Grid item xs={10}>
                {renderMCQQuestions}
                {renderCodeQuestions}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4} lg={3}>
            <Paper style={this.styles.card}>
              <Grid container direction="row" justify="flex-start">
                <Grid
                  item
                  style={{
                    ...this.styles.seperator,
                    ...this.styles.font,
                    fontSize: 22,
                  }}
                  xs={12}
                >
                  Marks Overview
                </Grid>
                <Grid
                  item
                  style={{ ...this.styles.type, ...this.styles.font }}
                  xs={6}
                >
                  Type
                </Grid>
                <Grid
                  item
                  style={{ ...this.styles.type, ...this.styles.font }}
                  xs={2}
                >
                  Qty
                </Grid>
                <Grid
                  item
                  style={{ ...this.styles.type, ...this.styles.font }}
                  xs={2}
                >
                  Marks
                </Grid>

                <Grid
                  item
                  style={{ ...this.styles.type, ...this.styles.font }}
                  xs={6}
                >
                  M C Q
                </Grid>
                <Grid
                  item
                  style={{ ...this.styles.type, ...this.styles.font }}
                  xs={2}
                >
                  {this.state.data ? this.state.data.count.mcq : ''}
                </Grid>
                <Grid
                  item
                  style={{ ...this.styles.type, ...this.styles.font }}
                  xs={2}
                >
                  {this.state.data ? this.marksCalculator().mcq : ''}
                </Grid>

                <Grid
                  item
                  style={{ ...this.styles.type, ...this.styles.font }}
                  xs={6}
                >
                  Code
                </Grid>
                <Grid
                  item
                  style={{ ...this.styles.type, ...this.styles.font }}
                  xs={2}
                >
                  {this.state.data ? this.state.data.count.code : ''}
                </Grid>
                <Grid
                  item
                  style={{ ...this.styles.type, ...this.styles.font }}
                  xs={2}
                >
                  {this.state.data ? this.marksCalculator().code : ''}
                </Grid>

                <Grid
                  item
                  style={{ ...this.styles.seperator, paddingTop: 0 }}
                  xs={12}
                ></Grid>

                <Grid
                  item
                  style={{ ...this.styles.total, fontSize: 24 }}
                  xs={12}
                >
                  Total Marks :{' '}
                  {this.state.data
                    ? this.marksCalculator().total
                    : ''}
                </Grid>
              </Grid>
            </Paper>
            <ThemeProvider theme={innerTheme}>
              <Button
                onClick={this.handleUpdate}
                color="primary"
                style={{
                  ...this.styles.btn,
                  marginTop: 20,
                  width: '100%',
                }}
                variant="contained"
              >
                Update
              </Button>
            </ThemeProvider>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ViewTest;
