import React, { Component } from 'react';
import { Grid, Paper, Button, Slide } from '@material-ui/core';

class Review extends Component {
    state = { }
    styles={
        wrapper:{
            marginTop: 80
        },
        paper:{
            width: '100%',
            // padding: '40px 0px',
            display: 'flex',
            fontFamily: 'Nunito',
            fontSize: 16,
            letterSpacing: 2,
            color: '#797979',
            boxShadow: '#c6e0e4 2px 2px 14px',
            borderRadius: 10,
            padding: 20
        },
        circle:{
            borderRadius: 800,
            width: 70,
            height: 70,
            color: '#fff',
            textAlign: 'center',
            margin: '0px 10px'
        },
        marked:{
            borderRadius: 800,
            width: 70,
            height: 70,
            color: '#fff',
            textAlign: 'center',
            margin: '0px 10px',
            background: 'rgba(245, 170, 0, 0.57)'
        },
        reviewed:{
            borderRadius: 800,
            width: 70,
            height: 70,
            color: '#fff',
            textAlign: 'center',
            margin: '0px 10px',
            background: 'rgb(94, 222, 101)'
        },
        null:{
            borderRadius: 800,
            width: 70,
            height: 70,
            color: '#000',
            textAlign: 'center',
            margin: '0px 10px',
            border: '1px solid rgb(189, 189, 189)'
        },
        markedCurrent:{
            borderRadius: 800,
            width: 70,
            height: 70,
            color: '#fff',
            textAlign: 'center',
            margin: '0px 10px',
            background: 'rgba(245, 170, 0, 0.57)',
            border: '2px #545d52 solid'
        },
        reviewedCurrent:{
            borderRadius: 800,
            width: 70,
            height: 70,
            color: '#fff',
            textAlign: 'center',
            margin: '0px 10px',
            background: 'rgb(94, 222, 101)',
            border: '2px #545d52 solid'
        },
        nullCurrent:{
            borderRadius: 800,
            width: 70,
            height: 70,
            color: '#000',
            textAlign: 'center',
            margin: '0px 10px',
            border: '2px #545d52 solid'
        }
    }
    render() {
        const renderCircle = this.props.reviews.map(r=>{
            return(
                <Grid item >
                    <Button onClick={()=>this.props.show(r.number)}
                    style={
                        this.styles.circle,
                        this.props.currentQuestion==r.number?(
                            r.status==='null'?(this.styles.nullCurrent):(r.status==='marked'?(this.styles.markedCurrent):(this.styles.reviewedCurrent))
                        ):(
                            r.status==='null'?(this.styles.null):(r.status==='marked'?(this.styles.marked):(this.styles.reviewed))
                        )
                        }
                    >
                        {r.number}
                    </Button>
                </Grid>
            )
        })
        return ( 
            <React.Fragment>
                <Grid container direction='row' justify='center'>
                    <Grid item xs={12}>
                        <Slide in={true} style={{transitionDelay: '200ms'}} direction='left'>
                        <Paper style={this.styles.paper} >
                            <Grid container direction='row' justify='center' spacing={1} >
                                <Grid item xs={12}>
                                    <div style={{textAlign: 'center',padding: '0px 0px 20px 0px'}} >Questions
                                    {/* <div style={{textAlign: 'center',display: 'flex',alignItems: 'center'}} >
                                        <div style={{marginRight: 20, marginLeft: 40,width: 10,height: 10,borderRadius: 20, background: 'rgba(245, 170, 0, 0.57)'}} ></div>Marked-{this.props.marked} </div> */}
                                    <div style={{textAlign: 'center',display: 'flex',alignItems: 'center'}} >
                                        <div style={{marginRight: 20, marginLeft: 40,width: 10,height: 10,borderRadius: 20, background: 'rgb(94, 222, 101)'}} ></div>Attempted-{this.props.attempted} </div>
                                    <div style={{textAlign: 'center',paddingBottom: 20,display: 'flex',alignItems: 'center'}} >
                                        <div style={{marginRight: 20, marginLeft: 40,width: 10,height: 10,borderRadius: 20, background: '#eee'}} ></div>Not attempted-{this.props.notattempted} </div>
                                    </div>
                                </Grid>
                                {renderCircle}
                            </Grid>
                        </Paper>
                        </Slide>
                    </Grid>
                </Grid>
            </React.Fragment>
         );
    }
}
 
export default Review;