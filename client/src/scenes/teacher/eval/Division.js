import React, { Component } from 'react';
import Header from '../../components/header';
import { Grid } from '@material-ui/core';
import Card from '../home/Card';

class Division extends Component {
    state = {  }
    componentDidMount(){
        // window.history.forward(1)
    }
    render() { 
        return ( 
            <React.Fragment>
                <Header/>
                <Grid
                container
                direction='row'
                justify='center'
                style={{background: '#f3faff',height: '100vh'}}
                >
                    <Grid item xs={10} >
                        <Grid style={{marginTop: 40}} spacing={4} container direction='row' justify='center'>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='A' delay={{transitionDelay: '10ms'}} link='/student-list' text='Div A' />
                            </Grid>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='B' delay={{transitionDelay: '100ms'}} link='/student-list' text='Div B' />
                            </Grid>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='C' delay={{transitionDelay: '200ms'}} link='/student-list' text='Div C' />
                            </Grid>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='D' delay={{transitionDelay: '300ms'}} link='/student-list' text='Div D' />
                            </Grid>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='E' delay={{transitionDelay: '400ms'}} link='/student-list' text='Div E' />
                            </Grid>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='F' delay={{transitionDelay: '400ms'}} link='/student-list' text='Div F' />
                            </Grid>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='G' delay={{transitionDelay: '400ms'}} link='/student-list' text='Div G' />
                            </Grid>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='H' delay={{transitionDelay: '400ms'}} link='/student-list' text='Div H' />
                            </Grid>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='I' delay={{transitionDelay: '400ms'}} link='/student-list' text='Div I' />
                            </Grid>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='J' delay={{transitionDelay: '400ms'}} link='/student-list' text='Div J' />
                            </Grid>
                            <Grid item xs={6} md={4} lg={3} >
                                <Card division='K' delay={{transitionDelay: '400ms'}} link='/student-list' text='Div K' />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
         );
    }
}
 
export default Division;
