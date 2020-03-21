import React, { Component } from 'react';
import { Grid, Button } from '@material-ui/core';
import Timer from 'react-compound-timer';
import Review from './Review';
import Info from './info';
import Axios from 'axios';
import { PulseLoader } from 'react-spinners';
import alertConfirm from 'react-alert-confirm';
import SectionB from './SectionB';

class NewSectionB extends Component {
  state = {
    time: 500,
    currentQuestion: 0,
    count: 0,
    reviews: [],
    optionsSelected: [],
    loading: true,
    cheat: 0,
  };

  // ------------ Functions for the Reviews Section ------------

  // This function is used to change the current question value
  show = qn => {
    // Getting time from the Timer component
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
      //   console.log(h * 3600 + m * 60 + s);
    }

    Axios.post(
      '/api/students/runProgram',
      {
        paperId: localStorage.getItem('id'),
        questionId: this.state.data[this.state.currentQuestion][
          '_id'
        ],
        program: this.state.optionsSelected[
          this.state.currentQuestion
        ],
        time: h * 60 * 60 + m * 60 + s,
        currentSection: 'Code',
      },
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      },
    );

    Axios.post(
      '/api/students/saveOutput',
      {
        paperId: localStorage.getItem('id'),
        questionId: this.state.data[this.state.currentQuestion][
          '_id'
        ],
        optionsSelected: this.state.optionsSelected[
          this.state.currentQuestion
        ],
        time: h * 60 * 60 + m * 60 + s,
        currentSection: 'Code',
      },
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      },
    ).then(
      res => {
        console.log(res);
        // The question number passed here is the displayed value
        // Hence we need to subtract 1 in order to get the index
        this.setState({ currentQuestion: qn - 1 });
      },
      err => alert(err.response.data.error.msg),
    );
  };

  // This function calculates the number of
  // -> Marked
  // -> Reviewed
  // -> Not attempted
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

  // ------------ End of function related to Reviews section ------------

  addToOptionsSelected = text => {
    var arr = this.state.optionsSelected;
    arr[this.state.currentQuestion] = text;
    var rev = this.state.reviews;
    this.state.reviews.forEach(r => {
      if (r.number === this.state.currentQuestion + 1) {
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

  // Increment the current question by 1
  handleNext = () => {
    if (this.state.currentQuestion + 1 < this.state.count) {
      // Getting time from the Timer component
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
      }
      Axios.post(
        '/api/students/runProgram',
        {
          paperId: localStorage.getItem('id'),
          questionId: this.state.data[this.state.currentQuestion][
            '_id'
          ],
          program: this.state.optionsSelected[
            this.state.currentQuestion
          ],
          time: h * 60 * 60 + m * 60 + s,
          currentSection: 'Code',
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      );

      Axios.post(
        '/api/students/saveOutput',
        {
          paperId: localStorage.getItem('id'),
          questionId: this.state.data[this.state.currentQuestion][
            '_id'
          ],
          optionsSelected: this.state.optionsSelected[
            this.state.currentQuestion
          ],
          time: h * 60 * 60 + m * 60 + s,
          currentSection: 'Code',
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      ).then(
        res => {
          console.log(res);
          // The question number passed here is the displayed value
          // Hence we need to subtract 1 in order to get the index
          this.setState({
            currentQuestion: this.state.currentQuestion + 1,
          });
        },
        err => alert(err.response.data.error.msg),
      );
    }
  };

  // Decrement the current question by 1
  handlePrev = () => {
    if (this.state.currentQuestion - 1 >= 0) {
      // Getting time from the Timer component
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
      }
      Axios.post(
        '/api/students/runProgram',
        {
          paperId: localStorage.getItem('id'),
          questionId: this.state.data[this.state.currentQuestion][
            '_id'
          ],
          program: this.state.optionsSelected[
            this.state.currentQuestion
          ],
          time: h * 60 * 60 + m * 60 + s,
          currentSection: 'Code',
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      );

      Axios.post(
        '/api/students/saveOutput',
        {
          paperId: localStorage.getItem('id'),
          questionId: this.state.data[this.state.currentQuestion][
            '_id'
          ],
          optionsSelected: this.state.optionsSelected[
            this.state.currentQuestion
          ],
          time: h * 60 * 60 + m * 60 + s,
          currentSection: 'Code',
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      ).then(
        res => {
          console.log(res);
          // The question number passed here is the displayed value
          // Hence we need to subtract 1 in order to get the index
          this.setState({
            currentQuestion: this.state.currentQuestion - 1,
          });
        },
        err => alert(err.response.data.error.msg),
      );
    }
  };

  handleSubmit = () => {
    alertConfirm({
      title: 'Confirmation',
      content: 'Are you sure you want to submit the Test?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        // Getting time from the Timer component
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
        }
        Axios.post(
          '/api/students/runProgram',
          {
            paperId: localStorage.getItem('id'),
            questionId: this.state.data[this.state.currentQuestion][
              '_id'
            ],
            program: this.state.optionsSelected[
              this.state.currentQuestion
            ],
            time: h * 60 * 60 + m * 60 + s,
            currentSection: 'Code',
          },
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          },
        );

        Axios.post(
          '/api/students/saveOutput',
          {
            paperId: localStorage.getItem('id'),
            questionId: this.state.data[this.state.currentQuestion][
              '_id'
            ],
            optionsSelected: this.state.optionsSelected[
              this.state.currentQuestion
            ],
            time: h * 60 * 60 + m * 60 + s,
            currentSection: 'None',
          },
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          },
        ).then(
          res => {
            console.log(res);
            window.location = '/student';
          },
          err => alert(err.response.data.error.msg),
        );
      },
      onCancel: () => {
        console.log('cancel');
      },
    });
  };

  // ---------------- Copying ----------------
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
            while (key !== 5487) {
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

  // ----------------------------------------------------------------

  componentDidMount() {
    // ---------------- Avoiding copy ----------------
    document.addEventListener('keydown', this.my_onkeydown_handler);
    document.addEventListener('visibilitychange', () => {
      console.log(document.hidden, document.visibilityState);
      if (document.hidden) {
        this.warn();
        if (this.state.cheat % 3 === 2) {
          var key = parseInt(window.prompt('Enter unlock key'));
          while (key !== 5487) {
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

    // ----------------------------------------------------------------
    Axios.get(
      `/api/students/questions?paperId=${localStorage.getItem('id')}`,
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      },
    ).then(
      res => {
        var i = 0;
        var arr = [];
        var os = [];
        var selected = [...res.data.data.submittedAnswers.responses];
        for (i = 0; i < res.data.data.count.code; i++) {
          if (selected[i] != ' ') {
            arr.push({
              number: i + 1,
              status: 'reviewed',
            });
          } else {
            arr.push({
              number: i + 1,
              status: 'null',
            });
          }
          os.push(' ');
        }
        // Checking there are any coding question
        if (res.data.data.count.code == 0) {
          window.location = '/student';
        } else {
          this.setState({
            data: res.data.data.paper.code,
            time: res.data.data.submittedAnswers.time,
            count: res.data.data.count.code,
            reviews: arr,
            optionsSelected: res.data.data.submittedAnswers.responses,
            loading: false,
          });
        }
      },
      err => alert(err.response.data.error.msg),
    );
  }

  render() {
    console.log(this.state);
    return (
      <React.Fragment>
        {this.state.loading ? (
          <PulseLoader
            size={10}
            margin={2}
            color={'#123abc'}
            loading={true}
          />
        ) : (
          <React.Fragment>
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
                    localStorage.getItem('set')
                      ? localStorage.getItem('set')
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <Timer
                  initialTime={this.state.time * 1000}
                  direction="backward"
                  checkpoints={[
                    {
                      time: 0,
                      callback: () => {
                        alert('Timer expired');
                        Axios.post(
                          '/api/students/timeout',
                          {
                            paperId: localStorage.getItem('id'),
                            questionId: this.state.data[
                              this.state.currentQuestion
                            ]['_id'],
                            program: this.state.optionsSelected[
                              this.state.currentQuestion
                            ],
                            time: 0,
                            currentSection: 'Code',
                          },
                          {
                            headers: {
                              Authorization: localStorage.getItem(
                                'token',
                              ),
                            },
                          },
                        ).then(res => (window.location = '/student'));
                      },
                    },
                  ]}
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
              </Grid>

              {/* Buttons */}

              <Grid
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
                      <Button
                        variant="outlined"
                        disabled={this.state.currentQuestion == 0}
                        onClick={this.handlePrev}
                      >
                        Prev
                      </Button>
                    </Grid>
                    <Grid item>
                      {this.state.currentQuestion + 1 ==
                      this.state.count ? (
                        <Button
                          variant="outlined"
                          onClick={this.handleSubmit}
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          disabled={
                            this.state.currentQuestion + 1 ==
                            this.state.count
                          }
                          onClick={this.handleNext}
                        >
                          Next
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container direction="row" justify="center">
                <Grid item xs={11}>
                  <Grid container direction="row" justify="center">
                    <Grid item xs={9}>
                      <SectionB
                        questionNumber={
                          this.state.currentQuestion + 1
                        }
                        question={
                          this.state.data
                            ? this.state.data[
                                this.state.currentQuestion
                              ].title
                            : ''
                        }
                        update={text =>
                          this.addToOptionsSelected(text)
                        }
                        selectedAnswer={
                          this.state.optionsSelected[
                            this.state.currentQuestion
                          ] || ''
                        }
                        questionId={
                          this.state.data
                            ? this.state.data[
                                this.state.currentQuestion
                              ]._id
                            : ''
                        }
                        marks={
                          this.state.data
                            ? this.state.data[
                                this.state.currentQuestion
                              ].marks
                            : ''
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Review
                        // +1 because we need to pass the actual qn not the index
                        currentQuestion={
                          this.state.currentQuestion + 1
                        }
                        show={qn => this.show(qn)}
                        reviews={this.state.reviews}
                        marked={this.calculateReviews()[0]}
                        attempted={this.calculateReviews()[1]}
                        notattempted={this.calculateReviews()[2]}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default NewSectionB;
