import React, { Component } from 'react';
import Header from '../../components/header';
import {
  Grid,
  Paper,
  InputBase,
  Button,
  Slide,
  Zoom,
} from '@material-ui/core';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-textmate';
import Info from '../../student/info';
import Axios from 'axios';

class EvalCode extends Component {
  state = {
    count: 0,
    body: '',
    data: null,
    code: [],
    inp: {},
    currentQuestion: 1,
  };
  styles = {
    question: {
      fontFamily: 'Nunito',
      fontSize: 20,
      color: '#515154',
      letterSpacing: 1,
    },
    myPaper: {
      background: '#FFF',
      boxShadow:
        '0px 4px 4px rgba(0, 0, 0, 0.24), 0px 0px 4px rgba(0, 0, 0, 0.12)',
      zIndex: 2,
      marginTop: 10,
      fontFamily: 'Nunito',
      letterSpacing: 1,
    },
    run: {
      background: '#4880FF',
      padding: 20,
      color: '#FFF',
      borderRadius: 0,
      fontFamily: 'Nunito',
      letterSpacing: 1,
    },
    code: {
      padding: 20,
      color: '#515154',
      fontFamily: 'Nunito',
      letterSpacing: 4,
    },
    editor: {
      paddingTop: 10,
      background: '#FFF',
    },
    stdin: {
      background: '#FFF',
      borderRadius: 2,
      padding: 20,
      width: '100%',
      boxShadow: '0px 2px 4px rgba(81, 81, 84, 0.4)',
      marginTop: 20,
    },
    stdout: {
      background: '#FFF',
      borderRadius: 2,
      padding: 20,
      width: '100%',
      boxShadow: '0px 2px 4px rgba(81, 81, 84, 0.4)',
      marginBottom: 40,
    },
    card: {
      background: '#fff',
      padding: 40,
      // boxShadow: '2px 2px 25px #c6d1e8',
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
  generateBody = code => {
    var obj = [];
    code.forEach(q => {
      obj.push({
        questionId: q.questionId,
        marks: q.programMarks || 0,
      });
    });
    return obj;
  };
  generateInp = code => {
    var obj = {};
    var codeArray=[...code]
    for (var i = 0; i < codeArray.length; i++) {
      obj = { ...obj, [`q${i + 1}`]: codeArray[i].marks };
    }
    return obj;
  };
  handleField = (event, marks) => {
    if(event.target.value<=marks){
      this.setState({
        inp: {
          ...this.state.inp,
          [event.target.id]: event.target.value,
        },
      });
    }
    else{
      alert('Invalid marks')
    }
  };
  calculateTotal = () => {
    if (this.state.data) {
      var mcq = this.state.data.mcqMarksObtained;
      var code = 0;
      var p = this.state.inp;
      for (var key of Object.keys(p)) {
        if (parseFloat(p[key])) {
          code = code + parseFloat(p[key]);
        } else {
          code = code + 0;
        }
      }
      return mcq + code;
    } else {
      return 0;
    }
  };
  handleNext = () => {
    this.setState({
      currentQuestion: this.state.currentQuestion + 1,
    });
  };
  handlePrev = () => {
    this.setState({
      currentQuestion: this.state.currentQuestion - 1,
    });
  };
  processNewLine=(text)=>{
      let newText = text.split ('\n').map ((item, i) => <p>{item}</p>)
      return newText
  }
  componentDidMount = () => {
    if (this.props.location.studentProps) {
      Axios.get(
        `/api/students/responses?id=${this.props.location.studentProps.paperId}&sapId=${this.props.location.studentProps.sapId}`,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      ).then(
        res => {
          var body = this.generateBody(res.data.data.code);
          var inp = this.generateInp(res.data.data.code);
          this.setState({
            inp: inp,
            code: res.data.data.code,
            data: res.data.data,
            body: body,
            count: res.data.data.count.code,
          });
        },
        err => alert(err),
      );
    } else {
      this.props.history.push('/manage');
    }
  };
  handleSubmit = () => {
    var codeArray = [...this.state.code];
    var counter = 1;
    var temp = [];
    codeArray.forEach(i => {
      temp = [
        ...temp,
        {
          questionId: i._id,
          marks: this.state.inp[`q${counter}`]
            ?this.state.inp[`q${counter}`]
            : 0,
        },
      ];
      counter++;
    });
    console.log(temp);
    temp = {
      id: this.props.location.studentProps.paperId,
      sapId: this.props.location.studentProps.sapId,
      code: temp,
    };
    console.log(temp);
    Axios.post('/api/evaluate/code/responses', temp, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }).then(res => this.props.history.push('/student-list'),err=>{
      alert("Please try again\n\n"+err)
    });
  };
  processProgram = pgm => {
    return pgm !== null ? pgm : '';
  };
  render() {
    console.log(this.state);
    var count = 0;
    var delay = -50;
    const renderInp = this.state.code.map(q => {
      count++;
      delay = delay + 50;
      return (
        <Zoom in={true} style={{ transitionDelay: `${delay}ms` }}>
          <InputBase
            id={`q${count}`}
            type='number'
            value={this.state.inp[`q${count}`]}
            onChange={event => this.handleField(event, 5)}
            style={{ ...this.styles.inp, marginBottom: 20 }}
            placeholder={`Q${count}. Out of ${q.totalMarks} marks`}
          />
        </Zoom>
      );
    });
    return (
      <React.Fragment>
        <Header />
        <Grid container direction="row" justify="center">
          <Grid item xs={6} style={{ marginTop: 40 }}>
            <Info
              sapId={
                this.props.location.studentProps
                  ? this.props.location.studentProps.sapId
                  : ''
              }
              set={
                this.props.location.studentProps
                  ? this.props.location.studentProps.set
                  : ''
              }
            />
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={7}>
            <Grid container direction="row" justify="center">
              <Grid item xs={10} lg={8}>
                <Grid
                  container
                  style={{ marginTop: 20 }}
                  direction="row"
                  alignItems="center"
                  justify="center"
                  spacing={4}
                >
                  <Grid item>
                    {this.state.currentQuestion == 1 ? (
                      <Button
                        variant="outlined"
                        disabled
                        onClick={this.handlePrev}
                      >
                        Prev
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={this.handlePrev}
                      >
                        Prev
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    {this.state.count ==
                    this.state.currentQuestion ? (
                      <Button
                        variant="outlined"
                        disabled
                        onClick={this.handleNext}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={this.handleNext}
                      >
                        Next
                      </Button>
                    )}
                    {/* <Button variant='outlined' onClick={this.handlePrev} >Next</Button> */}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <div
                  style={{
                    marginTop: 40,
                    textAlign: 'center',
                    fontFamily: 'Nunito',
                    fontSize: 22,
                    color: '#515154',
                    letterSpacing: 1,
                  }}
                >
                  QUESTION {this.props.number}
                </div>
              </Grid>
              <Grid item xs={9}>
                <div style={this.styles.question}>
                  {/* {this.props.question?this.props.question.question.title:(
                                    <PulseLoader
                                    size={10}
                                    margin={2}
                                    color={"#123abc"}
                                    loading={true}
                                    />
                                    )} */}
                  {this.state.data
                    ? this.processNewLine(this.state.data.code[
                        this.state.currentQuestion - 1
                      ].title)
                    : ''}
                </div>
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={9}>
                <div
                  style={{
                    ...this.styles.myPaper,
                    ...this.styles.card,
                    padding: 0,
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <div style={this.styles.code}>CODE</div>
                  </div>
                </div>
                <div>
                  <InputBase
                    disabled={true}
                    value={
                      this.state.data
                        ? this.processProgram(
                            this.state.data.code[
                              this.state.currentQuestion - 1
                            ].program,
                          )
                        : ''
                    }
                    style={{
                      ...this.styles.stdin,
                      ...this.styles.inp,
                      color: '#000',
                      fontFamily: 'Nunito',
                      letterSpacing: 2,
                    }}
                    placeholder="INPUT"
                    multiline={true}
                    rows={20}
                  />
                </div>
                {/* <div style={{...this.styles.stdin, ...this.styles.inp, color: '#000', fontFamily: 'Nunito',letterSpacing: 2}} >
                                    <div>
                                        <div style={this.styles.code} >OUTPUT</div>
                                    </div>
                                </div> */}
                <InputBase
                  // style={this.styles.stdout}
                  style={{
                    ...this.styles.stdin,
                    ...this.styles.inp,
                    color: '#000',
                    fontFamily: 'Nunito',
                    letterSpacing: 2,
                    marginBottom: 60,
                  }}
                  multiline={true}
                  rows={5}
                  disabled
                  defaultValue="OUTPUT"
                  value={
                    this.state.data
                      ? this.state.data.code[
                          this.state.currentQuestion - 1
                        ].output.split('$')[0]
                      : ''
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="row" justify="center">
              <Grid item xs={12}>
                <div
                  style={{
                    marginTop: 40,
                    textAlign: 'center',
                    fontFamily: 'Nunito',
                    fontSize: 22,
                    color: '#515154',
                    letterSpacing: 1,
                  }}
                >
                  Marks
                </div>
              </Grid>
              <Grid item xs={12} md={12} lg={9}>
                <Slide in={true} direction="up">
                  <Paper style={this.styles.card}>
                    {/* <Zoom in={true} style={{transitionDelay: '100ms'}} >
                                        <InputBase
                                        style={{...this.styles.inp, marginBottom: 20}}
                                        placeholder='Question 1'
                                        />
                                    </Zoom>
                                    <Zoom in={true} style={{transitionDelay: '150ms'}} >
                                        <InputBase
                                        style={{...this.styles.inp, marginBottom: 20}}
                                        placeholder='Question 2'
                                        />
                                    </Zoom>
                                    <Zoom in={true} style={{transitionDelay: '200ms'}} >
                                        <InputBase
                                        style={{...this.styles.inp, marginBottom: 20}}
                                        placeholder='Question 3'
                                        />
                                    </Zoom> */}
                    {renderInp}
                    <div>
                      MCQ marks :{' '}
                      {this.state.data
                        ? this.state.data.mcqMarksObtained
                        : ''}
                      /
                      {this.state.data
                        ? this.state.data.mcqTotalMarks
                        : ''}{' '}
                    </div>
                    <div>Total Marks : {this.calculateTotal()} </div>
                    <Zoom
                      in={true}
                      style={{ transitionDelay: '250ms' }}
                    >
                      <Button
                        onClick={this.handleSubmit}
                        style={{ ...this.styles.btn, marginTop: 20 }}
                      >
                        Submit
                      </Button>
                    </Zoom>
                  </Paper>
                </Slide>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default EvalCode;
