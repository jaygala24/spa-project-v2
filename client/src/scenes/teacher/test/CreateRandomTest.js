import React, { Component } from 'react';
import Header from '../../components/header';
import { Grid, Paper, Button, Zoom, InputBase } from '@material-ui/core';
import Axios from 'axios';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const innerTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#bbe4ff'
      },
      secondary: {
          main: '#fff'
      }
    },
  });

class CreateRandomTest extends Component {
    state = { 
        set: '',
        easy: '',
        medium: '',
        difficult: '',
        codeIf: '',
        codeFor: '',
        codeWhile: '',
        time: ''
     }
    styles={
        card:{
            padding: 60,
            fontFamily: 'Nunito',
            fontSize: 28,
            letterSpacing: 6,
            color: '#797979',
            boxShadow: '#c6e0e4 2px 2px 14px',
            borderRadius: 10
        },
        inp:{
            background: '#fff',
            padding: '16px 24px',
            borderRadius: 16,
            boxShadow: '0 5px 30px 0 #d2d2d270',
            width: '100%',
            fontFamily: 'Nunito',
            margin: 10
        },
        btn:{
            width: '100%',
            background: '#62ce97',
            color: 'white',
            padding: '12px 0px',
            fontFamily: 'Nunito',
            letterSpacing: 1,
            borderRadius: 10,
            boxShadow: '0 5px 30px 0 #62ce97'
        },
    }
    handleField=(event)=>{
        this.setState({[event.target.id]: event.target.value})
    }
    createTest=()=>{
        // var c = confirm("Are you sure u want to create a new test?")
        if(true){
            Axios.post(`/api/papers`,{
                'single':{
                    'easy': parseInt(this.state.easy)?parseInt(this.state.easy):0,
                    'medium': parseInt(this.state.medium)?parseInt(this.state.medium):0,
                    'hard': parseInt(this.state.difficult)?parseInt(this.state.difficult):0
                },
                "code": {
                    "easy": parseInt(this.state.codeIf)?parseInt(this.state.codeIf):0,
                    "medium": parseInt(this.state.codeFor)?parseInt(this.state.codeFor):0,
                    "hard": parseInt(this.state.codeWhile)?parseInt(this.state.codeWhile):0
                },            
                "set": this.state.set,
                "time": parseInt(this.state.time)?parseInt(this.state.time):0
            },{
                headers:{
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(res=>{
                alert("Test created")
                this.props.history.push('/manage')
                // this.setState({
                //     set: '',
                //     easy: '',
                //     medium: '',
                //     difficult: '',
                //     code: ''
                // })
            },err=>{
                console.log(err)
                alert(err)
            })
        }
    }
    render() {
        console.log(this.state)
        return (
            <React.Fragment>
                <Header />
                <ThemeProvider theme={innerTheme}>
                <Grid
                spacing={4}
                container
                direction='row'
                justify='center'
                style={{background: '#f3faff',height: '100vh'}}
                >
                    <Grid item xs={12} md={11} lg={10} >
                        <Grid style={{marginTop: 40}} spacing={4} container direction='row' justify='center'>
                            <Grid item xs={5}>
                                <Zoom in={true}>
                                <Paper style={this.styles.card} >
                                <Grid container direction='row' justify='center'>
                                    <Grid item>
                                        <form>
                                            <InputBase 
                                            onChange={this.handleField}
                                            value={this.state.set}
                                            style={this.styles.inp}
                                            id="set"
                                            placeholder="Set Name"
                                            />
                                            <InputBase 
                                            onChange={this.handleField}
                                            value={this.state.single}
                                            style={this.styles.inp}
                                            id="easy"
                                            placeholder="MCQ questions ( Easy )"
                                            />
                                            <InputBase 
                                            onChange={this.handleField}
                                            value={this.state.single}
                                            style={this.styles.inp}
                                            id="medium"
                                            placeholder="MCQ questions ( Medium )"
                                            />
                                            <InputBase 
                                            onChange={this.handleField}
                                            value={this.state.single}
                                            style={this.styles.inp}
                                            id="difficult"
                                            placeholder="MCQ questions ( Difficult )"
                                            />
                                            <InputBase 
                                            onChange={this.handleField}
                                            value={this.state.codeIf}
                                            style={this.styles.inp}
                                            id="codeIf"
                                            placeholder="Switch and If Else"
                                            />
                                            <InputBase 
                                            onChange={this.handleField}
                                            value={this.state.codeFor}
                                            style={this.styles.inp}
                                            id="codeFor"
                                            placeholder="For Loop"
                                            />
                                            <InputBase 
                                            onChange={this.handleField}
                                            value={this.state.codeWhile}
                                            style={this.styles.inp}
                                            id="codeWhile"
                                            placeholder="While/Do While Loop"
                                            />
                                            <InputBase 
                                            onChange={this.handleField}
                                            value={this.state.time}
                                            style={this.styles.inp}
                                            id="time"
                                            placeholder="Time Duration (Minutes)"
                                            />
                                            {/* <TextField fullWidth id="set" label="Set Name" variant="outlined" /> */}
                                            {/* <TextField
                                            onChange={this.handleField}
                                            value={this.state.single}
                                            style={this.styles.field} fullWidth id="single" label="Number of MCQ questions" variant="outlined" /> */}
                                            {/* <TextField
                                            onChange={this.handleField}
                                            value={this.state.code}
                                            style={this.styles.field} fullWidth id="code" label="Number of Coding questions" variant="outlined" />
                                            <br/> */}
                                        </form>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Button style={{...this.styles.btn, marginTop: 10, width: '100%'}} onClick={this.createTest} variant='contained' color='primary'>
                                            Create
                                        </Button>
                                    </Grid>
                                </Grid>
                                </Paper>
                                </Zoom>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </ThemeProvider>
            </React.Fragment>
         );
    }
}
 
export default CreateRandomTest;