import React, { Component } from 'react';
import { Grid, Button } from '@material-ui/core';
import SectionB from './SectionB';
import Review from './Review';
import SectionA from './SectionA';
import Axios from 'axios';
import Timer from 'react-compound-timer';
import Alert from '../components/alert';
import Info from './info';
import { css } from '@emotion/core';
import { HashLoader } from 'react-spinners';
import { Redirect } from 'react-router-dom';

class Test extends Component {
  state = {
    data: undefined,
    sectionAcount: 0,
    currentQuestion: 1,
    optionsSelected: [],
    start: false,
    cheat: 0,
    open: false,
    isReady: false,
    sectionA: this.props.location.state.sectionA,
    sectionWarning: false,
    finished: false,
    isSubmitted: !this.props.location.state.sectionB,
    showTerminal: false,
    reviews: [
      {
        number: 1,
        status: 'null',
      },
      {
        number: 2,
        status: 'reviewed',
      },
      {
        number: 3,
        status: 'null',
      },
      {
        number: 4,
        status: 'marked',
      },
      {
        number: 5,
        status: 'reviewed',
      },
      {
        number: 6,
        status: 'null',
      },
      {
        number: 7,
        status: 'reviewed',
      },
      {
        number: 8,
        status: 'null',
      },
    ],
  };
  styles = {
    wrapper: {
      marginTop: 60,
    },
  };
  calculateReviews = () => {
    var arr = this.state.reviews;
    var marked = 0,
      reviewed = 0,
      notattempted = 0;
    arr.forEach(i => {
      if (i.status == 'null') {
        notattempted++;
      } else if (i.status == 'reviewed') {
        reviewed++;
      } else {
        marked++;
      }
    });
    return [marked, reviewed, notattempted];
  };
  populateReviews = count => {
    var i = 0;
    var arr = [];
    var os = [];
    for (i = 0; i < count; i++) {
      arr.push({
        number: i + 1,
        status: 'null',
      });
      os.push(' ');
    }
    this.setState({ reviews: arr, optionsSelected: os });
  };
  my_onkeydown_handler = event => {
    console.log('Key pressed: ' + event.keyCode);
    if (event.altKey) {
      console.log('Alt');
      event.returnValue = false;
    } else {
      switch (event.keyCode) {
        case 116: // 'F5'
          event.returnValue = false;
          // event.keyCode = 0;
          window.status = 'We have disabled F5';
          break;
        case 91: // 'Windows key'
          if (this.state.cheat % 3 === 2) {
            var key = parseInt(window.prompt('Enter unlock key'));
            while (key !== 6699) {
              key = parseInt(window.prompt('Enter unlock key'));
            }
          } else {
            alert('DO NOT PRESS PROHIBITED KEYS');
            this.warn();
          }
          this.setState({ cheat: this.state.cheat + 1 });
          event.returnValue = false;
          // event.keyCode = 0;
          window.status = 'We have disabled F5';
          break;
      }
    }
  };
  playBeep = duration => {
    var context = new AudioContext();
    var o = context.createOscillator();
    o.type = 'square';
    o.connect(context.destination);
    o.start();
    setTimeout(duration => o.stop(), duration);
  };
  warn = () => {
    this.playBeep(300);
    setTimeout(() => this.playBeep(300), 500);
  };
  componentDidMount() {
    document.addEventListener('keydown', this.my_onkeydown_handler);
    document.addEventListener('visibilitychange', () => {
      console.log(document.hidden, document.visibilityState);
      if (document.hidden) {
        this.warn();
        if (this.state.cheat % 3 === 2) {
          var key = parseInt(window.prompt('Enter unlock key'));
          while (key !== 6699) {
            key = parseInt(window.prompt('Enter unlock key'));
          }
        } else {
          alert('DO NOT MINIZIZE');
        }
        this.setState({ cheat: this.state.cheat + 1 });
      }
    });
    document.addEventListener('blur', () => {
      console.log('blur');
    });
    Axios.get(
      `/api/students/questions?set=${this.props.location.state.set}&type=MCQ`,
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      },
    ).then(
      res => {
        console.log(res.data.data.paper.totalTime);
        this.populateReviews(res.data.data.count.mcq);
        this.generateQuestionArray(res.data.data.paper.mcq);
        this.setState({
          time: res.data.data.paper.totalTime,
          isReady: true,
          start: true,
          data: res.data.data,
          sectionAcount: res.data.data.count.mcq,
          paperId: res.data.data.paper._id,
        });
      },
      err => {
        this.props.history.push('/student');
      },
    );
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(this.props);
    if (prevProps !== this.props) {
      console.log('inside');
      this.setState({
        SectionA: this.props.location.state.sectionA,
        isSubmitted:
          this.props.location.state.sectionA &&
          this.props.location.state.sectionB,
      });
    }
  }
  loadSectionB = () => {
    Axios.get(
      `/api/students/questions?set=${this.props.location.state.set}&type=code`,
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      },
    ).then(res => {
      this.populateReviews(res.data.data.count.code);
      this.setState({
        data: res.data.data,
        currentQuestion: 1,
        sectionAcount: res.data.data.count.code,
      });
    });
  };
  generateQuestionArray = mcq => {
    var mcq = mcq;
    var questions = [];
    mcq.forEach(q => {
      questions.push({
        questionId: q.question._id,
        marks: q.marks,
      });
    });
    this.setState({ questions: questions });
  };
  handleSubmit = () => {
    this.eval(res => {
      console.log(res);
      this.setState({
        sectionWarning: true,
        subId: res.data.data.submission.id,
      });
    }, true);
  };
  handleFinalSubmit = qId => {
    console.log('saving....');
    console.log(qId);
    if (qId) {
      console.log('Inside qId');
      console.log({
        sectionB: true,
        time: 0,
      });
      Axios.post(
        `/api/saveOutput/${qId}`,
        {
          sectionB: true,
          time: 0,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      ).then(res => {
        console.log('Saved');
        console.log(res);
        // localStorage.clear();
      });
    }
    console.log('out');
    this.setState({ finished: true });
  };
  eval = (callback, flag) => {
    var body = {};
    if (document.getElementById('timer-hours')) {
      var h = parseInt(
        document.getElementById('timer-hours').innerHTML,
      );
      var m = parseInt(
        document.getElementById('timer-minutes').innerHTML,
      );
      var s = parseInt(
        document.getElementById('timer-seconds').innerHTML,
      );
      console.log(h * 3600 + m * 60 + s);
    }
    if (this.state.subId) {
      if (flag) {
        console.log('insideflag');
        body = {
          paperId: this.state.paperId,
          questions: this.state.questions,
          optionsSelected: this.state.optionsSelected,
          sectionA: true,
          sectionB: this.state.sectionA,
          id: this.state.subId,
          time: h * 3600 + m * 60 + s,
        };
      } else {
        console.log('inside2flag');
        body = {
          paperId: this.state.paperId,
          questions: this.state.questions,
          optionsSelected: this.state.optionsSelected,
          sectionA: false,
          sectionB: !this.state.sectionA,
          id: this.state.subId,
          time: h * 3600 + m * 60 + s,
        };
      }
    } else {
      console.log('inside3flag');
      body = {
        paperId: this.state.paperId,
        questions: this.state.questions,
        optionsSelected: this.state.optionsSelected,
        sectionA: true,
        sectionB: this.state.sectionA,
        time: h * 3600 + m * 60 + s,
      };
    }
    console.log(body);
    Axios.post('/api/students/questions/mcq', body, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }).then(
      res => callback(res),
      error => {
        console.log(error);
        console.log(body);
        alert(error);
      },
    );
  };
  addToOptionsSelected = text => {
    var arr = this.state.optionsSelected;
    arr[this.state.currentQuestion - 1] = text;
    var rev = this.state.reviews;
    this.state.reviews.forEach(r => {
      console.log(r.status);
      if (r.number === this.state.currentQuestion) {
        if (r.status !== 'marked') {
          rev[r.number - 1] = {
            number: r.number,
            status: 'reviewed',
          };
        }
      }
    });
    this.setState({ optionsSelected: arr, reviews: rev });
  };
  show = qn => {
    if (document.getElementById('timer-hours')) {
      var h = parseInt(
        document.getElementById('timer-hours').innerHTML,
      );
      var m = parseInt(
        document.getElementById('timer-minutes').innerHTML,
      );
      var s = parseInt(
        document.getElementById('timer-seconds').innerHTML,
      );
      console.log(h * 3600 + m * 60 + s);
    }
    if (this.state.sectionA) {
      this.eval(res => {
        console.log(res);
        this.setState({ subId: res.data.data.submission.id });
      });
    }
    var qId = this.state.data.paper.code.length
      ? this.state.data.paper.code[this.state.currentQuestion - 1]
          .question._id
      : null;
    if (qId) {
      console.log(
        this.state.data.paper.code[this.state.currentQuestion - 1]
          .question._id,
      );
      Axios.post(
        '/api/runProgram',
        {
          program: localStorage.getItem(
            `backUpCode${this.state.currentQuestion}`,
          ),
          questionId: this.state.data.paper.code[
            this.state.currentQuestion - 1
          ].question._id,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      ).then(
        () => {
          Axios.post(
            `/api/saveOutput/${qId}`,
            {
              sectionB: false,
              time: h * 3600 + m * 60 + s,
            },
            {
              headers: {
                Authorization: localStorage.getItem('token'),
              },
            },
          ).then(res => {
            console.log(res);
          });
        },
        err => {
          alert('Something went wrong. Please try again.');
        },
      );
    }
    this.setState({ currentQuestion: qn });
  };
  handlePrev = (text, qId) => {
    if (document.getElementById('timer-hours')) {
      var h = parseInt(
        document.getElementById('timer-hours').innerHTML,
      );
      var m = parseInt(
        document.getElementById('timer-minutes').innerHTML,
      );
      var s = parseInt(
        document.getElementById('timer-seconds').innerHTML,
      );
      console.log(h * 3600 + m * 60 + s);
    }
    // var arr = this.state.reviews
    // this.state.reviews.forEach(r=>{
    //     console.log(r.status)
    //     if(r.number===this.state.currentQuestion){
    //         if(r.status!=='marked'){
    //             arr[r.number-1]={
    //                 number: r.number,
    //                 status: 'reviewed'
    //             }
    //         }
    //     }
    // })
    // Axios.post('http://localhost')
    if (qId) {
      Axios.post(
        '/api/runProgram',
        {
          program: localStorage.getItem(
            `backUpCode${this.state.currentQuestion}`,
          ),
          questionId: this.state.data.paper.code[
            this.state.currentQuestion - 1
          ].question._id,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      ).then(
        () => {
          Axios.post(
            `/api/saveOutput/${qId}`,
            {
              sectionB: false,
              time: h * 3600 + m * 60 + s,
            },
            {
              headers: {
                Authorization: localStorage.getItem('token'),
              },
            },
          ).then(res => {
            console.log(res);
          });
        },
        err => {
          alert('Something went wrong. Please try again.');
        },
      );
    }
    if (text === 'mcq') {
      this.eval(res => {
        console.log(res);
        this.setState({
          subId: res.data.data.submission.id,
          currentQuestion: this.state.currentQuestion - 1,
        });
      });
    } else {
      this.setState({
        currentQuestion: this.state.currentQuestion - 1,
        showTerminal: false,
      });
    }
  };
  handleNext = (text, qId) => {
    if (document.getElementById('timer-hours')) {
      var h = parseInt(
        document.getElementById('timer-hours').innerHTML,
      );
      var m = parseInt(
        document.getElementById('timer-minutes').innerHTML,
      );
      var s = parseInt(
        document.getElementById('timer-seconds').innerHTML,
      );
      console.log(h * 3600 + m * 60 + s);
    }
    if (qId) {
      Axios.post(
        '/api/runProgram',
        {
          program: localStorage.getItem(
            `backUpCode${this.state.currentQuestion}`,
          ),
          questionId: this.state.data.paper.code[
            this.state.currentQuestion - 1
          ].question._id,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      ).then(
        () => {
          Axios.post(
            `/api/saveOutput/${qId}`,
            {
              sectionB: false,
              time: h * 3600 + m * 60 + s,
            },
            {
              headers: {
                Authorization: localStorage.getItem('token'),
              },
            },
          ).then(res => {
            console.log(res);
          });
        },
        err => {
          alert('Something went wrong. Please try again.');
        },
      );
    }
    // var arr = this.state.reviews
    // this.state.reviews.forEach(r=>{
    //     console.log(r.status)
    //     if(r.number===this.state.currentQuestion){
    //         if(r.status!=='marked'){
    //             arr[r.number-1]={
    //                 number: r.number,
    //                 status: 'reviewed'
    //             }
    //         }
    //     }
    // })
    if (text === 'mcq') {
      this.eval(res => {
        console.log(res);
        this.setState({
          subId: res.data.data.submission.id,
          currentQuestion: this.state.currentQuestion + 1,
        });
      });
    } else {
      this.setState({
        currentQuestion: this.state.currentQuestion + 1,
        showTerminal: false,
      });
    }
  };
  handleMark = () => {
    var arr = this.state.reviews;
    this.state.reviews.forEach(r => {
      if (r.number === this.state.currentQuestion) {
        if (r.status !== 'marked') {
          arr[r.number - 1] = {
            number: r.number,
            status: 'marked',
          };
        } else if (this.state.optionsSelected[r.number - 1] == ' ') {
          arr[r.number - 1] = {
            number: r.number,
            status: 'null',
          };
        } else {
          arr[r.number - 1] = {
            number: r.number,
            status: 'reviewed',
          };
        }
      }
    });
    this.setState({ reviews: arr });
  };
  render() {
    console.log(this.state);
    return (
      <React.Fragment>
        {/* <Header /> */}
        {!this.state.isSubmitted ? (
          <React.Fragment>
            <Alert
              open={this.state.open}
              message="You have exceeded the time limit for the test. Your responses have been recorded."
              affirmative="Submit"
              negative=""
              title="Timer Expired"
              callback={() => {
                localStorage.clear();
                this.setState({ open: false });
              }}
            />
            <Alert
              open={this.state.finished}
              message="Are you sure You want to submit the test?"
              affirmative="Submit"
              negative="No"
              title="Submit test"
              callback={res => {
                if (res == 'Submit') {
                  localStorage.clear();
                  this.setState({
                    finished: false,
                    isSubmitted: true,
                  });
                } else {
                  this.setState({ finished: false });
                }
              }}
            />
            <Alert
              open={this.state.sectionWarning}
              message="Once section A has been submited you will not be able to modify the answers of section A. Are you sure you want to submit Section A?"
              affirmative="Yes"
              negative="No"
              title="Confirmation"
              callback={res => {
                console.log(res);
                if (res == 'Yes') {
                  // this.eval(()=>{
                  //     this.setState({sectionA: false, sectionWarning: false})
                  // })

                  // uncomment the above code
                  // and clear the review questions array
                  this.setState({
                    sectionA: false,
                    sectionWarning: false,
                  });
                } else {
                  console.log('IN');
                  this.setState({ sectionWarning: false });
                }
              }}
            />
            <Grid container direction="row" justify="center">
              <Grid item xs={6}>
                <Info
                  cheat={this.state.cheat}
                  sapId={
                    localStorage.getItem('sapId')
                      ? localStorage.getItem('sapId')
                      : ''
                  }
                  set={
                    this.props.location.state.set
                      ? this.props.location.state.set
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {this.state.start ? (
                  <Timer
                    initialTime={this.state.time * 1000}
                    direction="backward"
                    checkpoints={[
                      {
                        time: 0,
                        callback: () => {
                          alert('Timer expired');
                          // if (this.sectionA) {
                          //   this.eval(res => {
                          //     console.log(res);
                          //     this.setState({ isSubmitted: true });
                          //   });
                          // } else {
                          this.setState({ isSubmitted: true });
                          // }
                        },
                      },
                    ]}
                    // startImmediately={false}
                  >
                    {(
                      start,
                      resume,
                      pause,
                      stop,
                      reset,
                      timerState,
                    ) => (
                      <React.Fragment>
                        <div
                          style={{
                            fontFamily: 'Nunito',
                            fontSize: 32,
                            color: '#6b6b6b',
                            textAlign: 'center',
                            marginTop: 20,
                          }}
                        >
                          <span>Timer : </span>
                          <span id="timer-hours">
                            <Timer.Hours />
                          </span>{' '}
                          hours
                          <span id="timer-minutes">
                            <Timer.Minutes />
                          </span>{' '}
                          minutes
                          <span id="timer-seconds">
                            <Timer.Seconds />
                          </span>{' '}
                          seconds
                        </div>
                      </React.Fragment>
                    )}
                  </Timer>
                ) : (
                  ''
                )}
              </Grid>
              <Grid item xs={6} lg={8}>
                {this.state.isReady ? (
                  <React.Fragment>
                    <Grid
                      style={this.styles.wrapper}
                      container
                      direction="row"
                      justify="center"
                      spacing={4}
                    >
                      <Grid item xs={10} lg={8}>
                        <Grid
                          container
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
                            ) : this.state.sectionA ? (
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  this.handlePrev(
                                    'mcq',
                                    this.state.data
                                      ? this.state.data.paper.code[
                                          this.state.currentQuestion -
                                            1
                                        ].question._id
                                      : null,
                                  )
                                }
                              >
                                Prev
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  this.handlePrev('code')
                                }
                              >
                                Prev
                              </Button>
                            )}
                          </Grid>
                          {/* <Grid itemxs={3} ><div style={{textAlign: 'center'}} >QUESTION 1</div></Grid> */}
                          <Grid item>
                            <Button
                              variant="outlined"
                              onClick={this.handleMark}
                            >
                              {this.state.reviews[
                                this.state.currentQuestion - 1
                              ]
                                ? this.state.reviews[
                                    this.state.currentQuestion - 1
                                  ].status == 'marked'
                                  ? 'Unmark'
                                  : 'Mark'
                                : ''}
                            </Button>
                          </Grid>
                          <Grid item>
                            {this.state.currentQuestion ==
                            this.state.sectionAcount ? (
                              this.state.sectionA ? (
                                <Button
                                  variant="outlined"
                                  onClick={this.handleSubmit}
                                >
                                  Submit
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  onClick={() =>
                                    this.handleFinalSubmit(
                                      this.state.data
                                        ? this.state.data.paper.code[
                                            this.state
                                              .currentQuestion - 1
                                          ].question._id
                                        : null,
                                    )
                                  }
                                >
                                  Submit
                                </Button>
                              )
                            ) : this.state.sectionA ? (
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  this.handleNext('mcq', null)
                                }
                              >
                                Next
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  this.handleNext(
                                    'code',
                                    this.state.data
                                      ? this.state.data.paper.code[
                                          this.state.currentQuestion -
                                            1
                                        ].question._id
                                      : null,
                                  )
                                }
                              >
                                Next
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    {this.state.sectionA ? (
                      <SectionA
                        selectedAnswer={
                          this.state.optionsSelected[
                            this.state.currentQuestion - 1
                          ] || ''
                        }
                        type="Single"
                        number={this.state.currentQuestion}
                        update={text =>
                          this.addToOptionsSelected(text)
                        }
                        options={
                          this.state.data
                            ? this.state.data.paper.mcq[
                                this.state.currentQuestion - 1
                              ].question.options
                            : []
                        }
                        question={
                          this.state.data
                            ? this.state.data.paper.mcq[
                                this.state.currentQuestion - 1
                              ]
                            : ''
                        }
                      />
                    ) : (
                      <SectionB
                        load={this.loadSectionB}
                        selectedAnswer={
                          this.state.optionsSelected[
                            this.state.currentQuestion - 1
                          ] || ''
                        }
                        type="Code"
                        showTerminal={this.state.showTerminal}
                        number={this.state.currentQuestion}
                        update={text =>
                          this.addToOptionsSelected(text)
                        }
                        question={
                          this.state.data
                            ? this.state.data.paper.code[
                                this.state.currentQuestion - 1
                              ]
                            : ''
                        }
                      />
                    )}
                  </React.Fragment>
                ) : (
                  <HashLoader
                    css={css`
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    `}
                    size={50}
                    margin={2}
                    //size={"150px"} this also works
                    color={'#123abc'}
                    loading={true}
                  />
                )}
                {/* <SectionA type='Multiple' /> */}
              </Grid>
              <Grid item xs={5} lg={3}>
                <Grid
                  style={this.styles.wrapper}
                  container
                  direction="row"
                  justify="center"
                >
                  <Grid item xs={9}>
                    {this.state.isReady ? (
                      <Review
                        currentQuestion={this.state.currentQuestion}
                        show={qn => this.show(qn)}
                        reviews={this.state.reviews}
                        marked={this.calculateReviews()[0]}
                        attempted={this.calculateReviews()[1]}
                        notattempted={this.calculateReviews()[2]}
                      />
                    ) : (
                      ''
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        ) : (
          <Redirect
            to={{
              pathname: '/student',
            }}
          />
        )}
        {/* Buttons */}
      </React.Fragment>
    );
  }
}

export default Test;
