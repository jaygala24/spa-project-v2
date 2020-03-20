import React, { Component } from 'react'
import { Grid, Button } from '@material-ui/core';
import Timer from 'react-compound-timer';
import SectionA from './SectionA';
import Review from './Review';
import Info from './info';
import alertConfirm from 'react-alert-confirm';
import { PulseLoader } from 'react-spinners';
import Axios from 'axios';

class NewSectionA extends Component {
    state = { 
        time: 1000,
        currentQuestion: 0,
        count: 0,
        reviews: [],
        optionsSelected: [],
        loading: true,
        cheat: 0
     }

    // ---------------- Functions for handling Buttons ----------------

    // Increment the current question by 1
    handleNext=()=>{
        if(this.state.currentQuestion+1<this.state.count){
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
            Axios.post('/api/students/mcq/evaluate',{
                "paperId": localStorage.getItem('id'),
                "questionId": this.state.data[this.state.currentQuestion]['_id'],
                "optionsSelected": this.state.optionsSelected[this.state.currentQuestion],
                "time": h*60*60+m*60+s,
                "currentSection": "MCQ"
            },{
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            }).then(res=>{
                console.log(res)
                // The question number passed here is the displayed value
                // Hence we need to subtract 1 in order to get the index
                this.setState({ currentQuestion: this.state.currentQuestion+1 });
            },err=>alert(err.response.data.error.msg))
        }
    }

    // Decrement the current question by 1
    handlePrev=()=>{
        if(this.state.currentQuestion-1>=0){
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
            Axios.post('/api/students/mcq/evaluate',{
                "paperId": localStorage.getItem('id'),
                "questionId": this.state.data[this.state.currentQuestion]['_id'],
                "optionsSelected": this.state.optionsSelected[this.state.currentQuestion],
                "time": h*60*60+m*60+s,
                "currentSection": "MCQ"
            },{
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            }).then(res=>{
                console.log(res)
                // The question number passed here is the displayed value
                // Hence we need to subtract 1 in order to get the index
                this.setState({ currentQuestion: this.state.currentQuestion-1 });
            },err=>alert(err.response.data.error.msg))
        }
    }

    handleSubmit=()=>{
        alertConfirm({
            title: 'Confirmation',
            content: 'Are you sure you want to submit this section? Once submitted you will not be able to return back to section A.',
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
                Axios.post('/api/students/mcq/evaluate',{
                    "paperId": localStorage.getItem('id'),
                    "questionId": this.state.data[this.state.currentQuestion]['_id'],
                    "optionsSelected": this.state.optionsSelected[this.state.currentQuestion],
                    "time": h*60*60+m*60+s,
                    "currentSection": "Code"
                },{
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                }).then(res=>{
                    window.location='/section-b'
                },err=>alert(err.response.data.error.msg))
            },
            onCancel: () => {
                console.log('cancel');
            }
        })
    }

    // ----------------------------------------------------------------

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

        Axios.post('/api/students/mcq/evaluate',{
            "paperId": localStorage.getItem('id'),
            "questionId": this.state.data[this.state.currentQuestion]['_id'],
            "optionsSelected": this.state.optionsSelected[this.state.currentQuestion],
            "time": h*60*60+m*60+s,
            "currentSection": "MCQ"
        },{
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        }).then(res=>{
            console.log(res)
            // The question number passed here is the displayed value
            // Hence we need to subtract 1 in order to get the index
            this.setState({ currentQuestion: qn-1 });
        },err=>alert(err.response.data.error.msg))
    }

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

    // -This function is used to update the state
    // - It adds the text argument to the options selected array at the index of the current question
    addToOptionsSelected = text => {
        var arr = this.state.optionsSelected;
        arr[this.state.currentQuestion] = text;
        var rev = this.state.reviews;
        this.state.reviews.forEach(r => {
          if (r.number === this.state.currentQuestion+1) {
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
    
    // ----------------------------------------------------------------

    componentDidMount(){

        console.log('Did Mount')

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

        Axios.get(`/api/students/questions?paperId=${localStorage.getItem('id')}`,{
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        })
        .then(res=>{
            if(res.data.data.count.mcq>0){
                var i = 0;
                var arr = [];
                var os = [];
                var selected=[...res.data.data.submittedAnswers.responses]
                for (i = 0; i < res.data.data.count.mcq; i++) {
                    if(selected[i]!=' '){
                        arr.push({
                            number: i + 1,
                            status: 'reviewed'
                        });    
                    }
                    else{
                        arr.push({
                            number: i + 1,
                            status: 'null'
                        });
                    }
                    os.push(' ');
                }
                console.log('Updating', res.data.data.submittedAnswers.responses)
                this.setState({
                    data: res.data.data.paper.mcq,
                    time: res.data.data.submittedAnswers.time,
                    count: res.data.data.count.mcq,
                    reviews: arr,
                    optionsSelected: res.data.data.submittedAnswers.responses,
                    loading: false
                }
            )   
            }
            else{
                window.location='section-b'
            }
        },err=>alert(err.response.data.error.msg))
    }

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

    render() {
        console.log('rendering')
        console.log(this.state)
        return ( 
            <React.Fragment>
                {/* Shows the spinner */}
                {this.state.loading?(
                    <PulseLoader
                    size={10}
                    margin={2}
                    color={'#123abc'}
                    loading={true}
                  />
                ):(
                    // If loading is false then display the content
                    <Grid container direction="row" justify="center">
                        <Grid item xs={5}>
                            {/* Info component show the basic information of the student */}
                            <Info
                            cheat={this.state.cheat}
                            sapId={
                                localStorage.getItem('sapId')
                                ? localStorage.getItem('sapId')
                                : ''
                            }
                            set={localStorage.getItem('set')
                            ? localStorage.getItem('set')
                            : ''}
                            />
                        </Grid>
                        <Grid item xs={6}>
                        {/* ---------------- Timer ---------------- */}
                            <Timer
                                initialTime={this.state.time * 1000}
                                direction="backward"
                                checkpoints={[
                                {
                                    time: 0,
                                    callback: () => {
                                    alert('Timer expired');
                                    Axios.post('/api/students/timeout',{
                                        "paperId": localStorage.getItem('id'),
                                        "questionId": this.state.data[this.state.currentQuestion]['_id'],
                                        "optionsSelected": this.state.optionsSelected[this.state.currentQuestion],
                                        "time": 0,
                                        "currentSection": "MCQ"
                                    },{
                                        headers: {
                                            Authorization: localStorage.getItem('token'),
                                        }
                                    }).then(res=>window.location='/student')
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
                        {/* ---------------- Timer Ends ---------------- */}
                        </Grid>

                        {/* -------------------------------- Section A -------------------------------- */}

                        {/* -------------------------------- Buttons -------------------------------- */}

                        <Grid container style={{width: '100%'}} direction="row" justify="center" spacing={4} >
                            <Grid item xs={10} lg={8}>
                                <Grid container direction="row" alignItems="center" justify="center" spacing={4} >
                                    <Grid item>
                                        <Button variant="outlined" disabled={this.state.currentQuestion==0} onClick={this.handlePrev} >
                                            Prev
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        {this.state.currentQuestion+1==this.state.count?(
                                            <Button variant="outlined" onClick={this.handleSubmit} >
                                                Submit
                                            </Button>
                                        ):(
                                            <Button variant="outlined" disabled={this.state.currentQuestion+1==this.state.count} onClick={this.handleNext} >
                                                Next
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* ---------------------------------------------------------------- */}


                        {/* -------------------------------- Lower part -------------------------------- */}
                        <Grid container direction='row' justify='center'>
                            <Grid item xs={11}>
                                <Grid container direction='row' justify='center'>
                                    <Grid item xs={8}>
                                        <SectionA
                                        // +1 because indexing starts from 0
                                        marks={this.state.data?this.state.data[this.state.currentQuestion].marks:''}
                                        questionNumber={this.state.currentQuestion+1}
                                        question={this.state.data?this.state.data[this.state.currentQuestion].title:''}
                                        options={this.state.data?this.state.data[this.state.currentQuestion].options:''}
                                        update={text=>this.addToOptionsSelected(text)}
                                        selectedAnswer={
                                            this.state.optionsSelected[
                                                this.state.currentQuestion
                                            ]
                                        }
                                        />         
                                    </Grid>

                                    {/* ---------------- Right side section ---------------- */}
                                    <Grid item xs={2}>
                                        <Review
                                            // +1 because we need to pass the actual qn not the index
                                            currentQuestion={this.state.currentQuestion+1}
                                            show={qn => this.show(qn)}
                                            reviews={this.state.reviews}
                                            marked={this.calculateReviews()[0]}
                                            attempted={this.calculateReviews()[1]}
                                            notattempted={this.calculateReviews()[2]}
                                        />
                                    </Grid>
                                    {/* ---------------------------------------------------------------- */}
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                )}
            </React.Fragment>
         );
    }
}
 
export default NewSectionA;