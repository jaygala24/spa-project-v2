import React, { Component } from 'react';
import {
  Grid,
  Paper,
  Button,
  Checkbox,
  Select,
  MenuItem,
  InputBase,
} from '@material-ui/core';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
//import { highlight, languages } from 'prismjs';
import Editor from 'react-simple-code-editor';
//import NumericInput from 'react-numeric-input';
import alertConfirm from 'react-alert-confirm';
import 'react-alert-confirm/dist/index.css';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';

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

class SelectQuestions extends Component {
  state = {
    filter: 'All',
    receivedTags: [],
    questions: [],
    redirect: false,
    search: ''
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
    inp: {
      background: '#fff',
      padding: '16px 24px',
      borderRadius: 16,
      boxShadow: '0 5px 30px 0 #d2d2d270',
      width: '60%',
      fontFamily: 'Nunito',
      margin: 10,
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

  // Trim the input to a specific size
  trimContent = text => {
    var arr = text.split(' ');
    var str = '';
    if (arr.length > 8) {
      for (var i = 0; i < 8; i++) {
        str = str + arr[i] + ' ';
      }
      return str;
    } else {
      return text;
    }
  };

  // Handling the checkbox
  check = id => {
    console.log(id);
    var newQuestions = [...this.state.questions];
    let obj = newQuestions.find((o, i) => {
      if (o._id === id) {
        newQuestions[i] = { ...o, checked: !o.checked };
        return true; // stop searching
      }
    });
    this.setState({ questions: newQuestions });
  };

  handleFilter = event => {
    this.setState({ filter: event.target.value });
  };

  calculateTotal = () => {
    var marks = 0;
    var questionCount = 0;
    var questions = [...this.state.questions];
    questions.forEach(q => {
      if (q.checked) {
        marks = marks + q.marks;
        questionCount = questionCount + 1;
      }
    });
    return {
      marks: marks,
      questionCount: questionCount,
    };
  };

  handleSubmit = () => {
    alertConfirm({
      title: 'Confirmation',
      content: 'Are you sure you want to create this test?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        Axios.post(
          '/api/papers',
          {
            ...this.generateReq(),
          },
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          },
        ).then(
          res => {
            alertConfirm({
              type: 'alert',
              okText: 'Ok',
              content: 'Test created successfully',
              onOk: () => {
                this.setState({ redirect: true });
              },
            });
          },
          err => alert(err.response.data.error.msg),
        );
      },
      onCancel: () => {
        console.log('cancel');
      },
    });
  };

  componentDidMount = () => {
    // Scroll to top
    window.scroll(0, 0);

    // Getting all questions
    Axios.get('/api/questions', {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }).then(
      res => {
        var newQuestions = [...res.data.data.questions];
        var count = res.data.data.count;

        // Adding two extra attributes: checked and marks
        for (var i = 0; i < count; i++) {
          newQuestions[i] = {
            ...newQuestions[i],
            // Initializing marks as 1 and unchecked
            checked: false,
            marks: 1,
          };
        }
        if (this.props.currentState) {
          newQuestions = this.props.currentState.questions;
        }
        this.highlighting(newQuestions).then(()=>{
          this.setState({
            // Appending 'All' tag to display all questions
            receivedTags: ['All', 'MCQ', 'Code', ...res.data.data.tags],
            questions: newQuestions
          });
        });
      },
      err => console.log(err),
    );
  };

  // Generates the body for createTest
  generateReq = () => {
    var temp = [...this.state.questions];
    var array = temp.filter(i => i.checked);
    var mcq = [];
    var code = [];
    array.forEach(i => {
      var obj = {
        questionId: i._id,
        marks: i.marks,
      };
      if (i.type == 'Single') {
        mcq.push(obj);
      } else if (i.type == 'Code') {
        code.push(obj);
      }
    });

    var d = new Date();

    var body = {
      set: this.props.set,
      type: this.props.type,
      time: parseInt(this.props.time * 60),
      mcq: mcq,
      code: code,
      year: d.getFullYear(),
    };
    return body;
  };
  highlighting = async (questions) => {
    const prism = await import('prismjs');
    questions.forEach(question=>{
      const res =  prism.highlight(question.title, prism.languages.js);
      question.code = res;
    });
  }; 
  render() {
    console.log(this.generateReq());

    const redirect = [1].map(i => <Redirect to="/manage" />);

    // Renders the dropdown of tags
    const renderOptions = this.state.receivedTags.map(tag => {
      return <MenuItem value={`${tag}`}> {tag} </MenuItem>;
    });

    // Renders the selected questions
    const renderSelected = this.state.questions
      .filter(q => q.checked)
      .map(question => {
        return (
          <Paper
            style={{ marginTop: 10, marginBottom: 10, padding: 10 }}
          >
            <div style={{ display: 'flex' }}>
              {this.trimContent(question.title)}
              <div style={{ flexGrow: 1 }}></div>
            </div>
            <span style={{letterSpacing: 2}} >Marks&nbsp;</span>
            <input
              onChange={event => {
                var newQuestions = this.state.questions;
                const target = event.target
                // Updating the marks - search by _id
                let obj = newQuestions.find((o, i) => {
                  if (o._id === question._id) {
                    newQuestions[i] = { ...o, marks: target.valueAsNumber };
                    return true; // stop searching
                  }
                });
                this.setState({ questions: newQuestions });
              }}
              size={1}
              type="number"
              min={1}
              max={100}
              value={parseInt(question.marks)}
            />
          </Paper>
        );
      });

    // Renders the questions
    const renderQuestions = this.state.questions
      .filter(q => {
        if (this.state.filter !== 'All') {
          if(this.state.filter=='MCQ'){
            return q.tag == this.state.filter||q.type == 'Single';
          }
          else{
            return q.tag == this.state.filter||q.type == this.state.filter;
          }
        } else {
          return true;
        }
      })
      .filter(q=>{
        if(this.state.search.trim()!=''){
          return Boolean(q.title.toLowerCase().includes(this.state.search.toLocaleLowerCase()))
        }
        else{
          console.log('in')
          return true
        }
      })
      .map((question, index) => {
        return (
          <Paper
            onClick={() => this.check(question._id)}
            style={{
              padding: 10,
              marginTop: 10,
              marginBottom: 10,
              display: 'flex',
            }}
          >
            <Checkbox
              edge="start"
              checked={question.checked}
              onClick={() => this.check(question._id)}
            />
            <Editor
              value={question.title}
              onValueChange={() => {}}
              disabled
              highlight={code => this.state.questions[index].code}
              padding={10}
              style={{
                fontFamily: 'Nunito',
                fontSize: 14,
              }}
            />
          </Paper>
        );
      });
    return (
      <React.Fragment>
        {this.state.redirect ? redirect : ''}
        {/* Basic info of the test */}
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={2}>
            <div style={{ ...this.styles.font, fontSize: 30 }}>
              SET : {this.props.set}
            </div>
          </Grid>
          <Grid item xs={3}>
            <Select
              variant="outlined"
              style={{
                ...this.styles.inp,
                padding: '0px 10px',
                width: 220,
              }}
              value={this.state.filter}
              onChange={this.handleFilter}
            >
              {renderOptions}
            </Select>
          </Grid>
          <Grid item xs={3}>
            <InputBase onChange={(e)=>this.setState({search: e.target.value})} fullWidth style={{...this.styles.inp, width: '80%', padding: '12px 24px'}} placeholder='Search keyword' />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="outlined"
              onClick={() => this.props.goBack(this.state)}
            >
              {' '}
              Previous step
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              {' '}
              Submit{' '}
            </Button>
          </Grid>
        </Grid>
        {/* ---- Top section ends here ---- */}

        <Grid
          style={{ marginTop: 10, width: '100%' }}
          spacing={4}
          container
          direction="row"
          justify="center"
        >
          {/* Left side - Question */}
          <Grid
            item
            xs={5}
            style={{ height: '70vh', overflow: 'scroll' }}
          >
            {renderQuestions}
          </Grid>

          {/* Right side - Selected questions */}
          <Grid
            item
            xs={5}
            style={{ height: '70vh', overflow: 'scroll' }}
          >
            <div>
              Selected Questions :{' '}
              {this.calculateTotal()['questionCount']}{' '}
            </div>
            <div>Total Marks : {this.calculateTotal()['marks']} </div>
            {renderSelected}
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default SelectQuestions;
