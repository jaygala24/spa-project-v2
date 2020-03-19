import React, { Component } from 'react';
import Header from '../../components/header';
import { Grid, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';

class Create extends Component {
    state = { 
        value: 'Single Choice',
        answer: 'a',
        checkedA: false,
        checkedB: false,
        checkedC: false,
        checkedD: false
     }
    handleChangeQuestion = event => {
        this.setState({value: event.target.value});
    };
    handleChangeAnswer = event => {
        this.setState({answer: event.target.value});
    };
    handleCheckbox = name => event => {
        console.log(event.target.checked)
        this.setState({[name]: event.target.checked });
    };
    render() { 
        return ( 
            <React.Fragment>
                <Header />
                <Grid
                container
                direction='row'
                justify='center'
                style={{background: '#eee',minheight: '100vh'}}
                >
                    <Grid item xs={10} >
                        <Grid style={{marginTop: 40}} spacing={4} container direction='row' justify='center'>
                            <Grid item xs={10}>
                                <form noValidate autoComplete="off">
                                <TextField style={{margin: '20px 0px'}} multiline rows={4} fullWidth id="outlined-basic" label="Question" variant="outlined" />
                                <div>Note: Comma seperated categories</div>
                                <TextField style={{margin: '10px 0px 20px 0px'}} fullWidth id="outlined-basic" label="Category" variant="outlined" />
                                <FormControl style={{margin: '20px 0px'}} component="fieldset">
                                <FormLabel style={{margin: '20px 0px'}}  component="legend">Question Type</FormLabel>
                                    <RadioGroup aria-label="question" name="question" value={this.state.value} onChange={this.handleChangeQuestion}>
                                    <FormControlLabel value="Single Choice" control={<Radio />} label="Single Choice" />
                                    <FormControlLabel value="Multiple Choice" control={<Radio />} label="Multiple Choice" />
                                    <FormControlLabel value="Code" control={<Radio />} label="Code" />
                                    </RadioGroup>
                                </FormControl>
                                {this.state.value!=='Code'?(
                                    <React.Fragment>
                                        <TextField style={{margin: '5px 0px'}} fullWidth id="outlined-basic" label="Option A" variant="outlined" />
                                        <TextField style={{margin: '5px 0px'}} fullWidth id="outlined-basic" label="Option B" variant="outlined" />
                                        <TextField style={{margin: '5px 0px'}} fullWidth id="outlined-basic" label="Option C" variant="outlined" />
                                        <TextField style={{margin: '5px 0px'}} fullWidth id="outlined-basic" label="Option D" variant="outlined" />
                                        {this.state.value=='Single Choice'?(
                                            <FormControl style={{margin: '20px 0px'}} component="fieldset">
                                            <FormLabel style={{margin: '20px 0px'}}  component="legend">Correct Answer</FormLabel>
                                                <RadioGroup aria-label="answer" name="answer" value={this.state.answer} onChange={this.handleChangeAnswer}>
                                                <FormControlLabel value="a" control={<Radio />} label="a" />
                                                <FormControlLabel value="b" control={<Radio />} label="b" />
                                                <FormControlLabel value="c" control={<Radio />} label="c" />
                                                <FormControlLabel value="d" control={<Radio />} label="d" />
                                                </RadioGroup>
                                            </FormControl>
                                        ):(
                                            <React.Fragment>
                                                <FormLabel style={{margin: '20px 0px'}}  component="legend">Correct Answer</FormLabel>
                                                <div style={{margin: '20px 0px'}} >
                                                    <Checkbox
                                                        checked={this.state.checkedA}
                                                        onChange={this.handleCheckbox('checkedA')}
                                                        value="checkedA"
                                                        inputProps={{
                                                        'aria-label': 'primary checkbox',
                                                        }}
                                                    />Option A <br/>
                                                    <Checkbox
                                                        checked={this.state.checkedB}
                                                        onChange={this.handleCheckbox('checkedB')}
                                                        value="checkedB"
                                                        inputProps={{
                                                        'aria-label': 'primary checkbox',
                                                        }}
                                                    />Option B <br/>
                                                    <Checkbox
                                                        checked={this.state.checkedC}
                                                        onChange={this.handleCheckbox('checkedC')}
                                                        value="checkedC"
                                                        inputProps={{
                                                        'aria-label': 'primary checkbox',
                                                        }}
                                                    />Option C <br/>
                                                    <Checkbox
                                                        checked={this.state.checkedD}
                                                        onChange={this.handleCheckbox('checkedD')}
                                                        value="checkedD"
                                                        inputProps={{
                                                        'aria-label': 'primary checkbox',
                                                        }}
                                                    />Option D <br/>
                                                </div>
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                ):(
                                    <div></div>
                                )}
                                <div><Button color='primary' variant='contained' >Submit</Button></div>
                                </form>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
         );
    }
}
 
export default Create;