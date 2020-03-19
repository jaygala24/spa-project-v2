import React, { Component } from 'react'
import { Grid, Button } from '@material-ui/core';
import Timer from 'react-compound-timer';
import SectionA from './SectionA';
import Review from './Review';
import Info from './info';
import Axios from 'axios';
import { compareSync } from 'bcrypt';

class NewSectionA extends Component {
    state = { 
        time: 1000,
        currentQuestion: 0,
        count: 0,
        reviews: []
     }

    // Increment the current question by 1
    handleNext=()=>{
        if(this.state.currentQuestion+1<this.state.count){
            this.setState({
                currentQuestion: this.state.currentQuestion+1
            })
        }
    }

    // Decrement the current question by 1
    handlePrev=()=>{
        if(this.state.currentQuestion-1<=0){
            this.setState({
                currentQuestion: this.state.currentQuestion-1
            })
        }
    }

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

        // The question number passed here is the displayed value
        // Hence we need to subtract 1 in order to get the index
        this.setState({ currentQuestion: qn-1 });
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

    // addToOptionsSelected = text => {
    //     console.log(text)
    //     var arr = this.state.optionsSelected;
    //     console.log(this.state.currentQuestion)
    //     arr[this.state.currentQuestion] = text;
    //     var rev = this.state.reviews;
    //     this.state.reviews.forEach(r => {
    //     //   console.log(r.status);
    //       if (r.number === this.state.currentQuestion) {
    //         if (r.status !== 'marked') {
    //           rev[r.number - 1] = {
    //             number: r.number,
    //             status: 'reviewed',
    //           };
    //         }
    //       }
    //     });
    //     this.setState({ optionsSelected: arr, reviews: rev });
    //   };

    componentDidMount(){
        Axios.get(`/api/students/questions?paperId=${localStorage.getItem('id')}`,{
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        })
        .then(res=>{
            var i = 0;
            var arr = [];
            var os = [];
            for (i = 0; i < res.data.data.count.mcq; i++) {
                arr.push({
                    number: i + 1,
                    status: 'null',
                });
                os.push(' ');
            }
            this.setState({
                data: res.data.data.paper.mcq,
                time: res.data.data.submittedAnswers.time,
                count: res.data.data.count.mcq,
                reviews: arr,
                optionsSelected: os 
            }
        )
        },err=>alert(err.response.data.error.msg))
    }

    render() {
        console.log(this.state)
        return ( 
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
                        set={localStorage.getItem('set')
                        ? localStorage.getItem('set')
                        : ''}
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
                                this.setState({ isSubmitted: true });
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

                    {/* Section A */}

                    {/* Buttons */}

                    <Grid container direction="row" justify="center" spacing={4} >
                        <Grid item xs={10} lg={8}>
                            <Grid container direction="row" alignItems="center" justify="center" spacing={4} >
                                <Grid item>
                                    <Button variant="outlined" disabled={this.state.currentQuestion==0} onClick={this.handlePrev} >
                                        Prev
                                    </Button>
                                </Grid>
                                {/* <Grid item>
                                    <Button variant="outlined" onClick={this.handlePrev} >
                                        Mark
                                    </Button>
                                </Grid> */}
                                <Grid item>
                                    <Button variant="outlined" disabled={this.state.currentQuestion+1==this.state.count} onClick={this.handleNext} >
                                        Next
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>


                    {/* Lower part */}
                    <Grid container direction='row' justify='center'>
                        <Grid item xs={11}>
                            <Grid container direction='row' justify='center'>
                                <Grid item xs={9}>
                                    <SectionA
                                    // +1 because indexing starts from 0
                                    questionNumber={this.state.currentQuestion+1}
                                    question={this.state.data?this.state.data[this.state.currentQuestion].title:''}
                                    options={this.state.data?this.state.data[this.state.currentQuestion].options:''}
                                    // update={text=>this.addToOptionsSelected(text)}
                                    />         
                                </Grid>


                                <Grid item xs={3}>
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
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </React.Fragment>
         );
    }
}
 
export default NewSectionA;