import React, { Component } from 'react';
import { Grid, Paper, Zoom, Button } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

class SectionA extends Component {
    state = { 
        val: '',
        optionCount: 4
     }
    styles = {
        question:{
            margin: '20px 0px',
            fontFamily: 'Nunito',
            fontSize: 20,
            color: '#515154',
            letterSpacing: 1
        },
        options:{
            padding: 20,
            margin: 5,
            width: '100%',
            fontFamily: 'Nunito',
            fontSize: 18,
            letterSpacing: 1,
            color: '#797979',
            boxShadow: '#c6e0e4 2px 2px 14px',
            borderRadius: 10
        }
    }
    handleOnChange = (event)=>{
        var option = event.target.value
        var text = ''
        if(option=='A'){
            text=this.props.question.question?this.props.question.question.options[0]:''
        }
        else if(option=='B'){
            text=this.props.question.question?this.props.question.question.options[1]:''
        }
        else if(option=='C'){
            text=this.props.question.question?this.props.question.question.options[2]:''
        }
        else{
            text=this.props.question.question?this.props.question.question.options[3]:''
        }
        // this.props.update(text)
        this.setState({val: event.target.value})
    }
    componentDidUpdate(prevProps,prevState){
        if(this.props!==prevProps&&this.state==prevState){
            console.log(this.props)
            this.setState({
                val: this.findOption(this.props.selectedAnswer,this.props.options),
                optionCount: this.props.options.length
            })
        }
    }
    findOption=(ans,opt)=>{
        var i=0
        if(opt){
            for(i=0;i<opt.length;i++){
                if(opt[i]==ans){
                    break
                }
            }
            if(i==0){
                return 'A'
            }
            else if(i==1){
                return 'B'
            }
            else if(i==2){
                return opt.length>2?'C':''
            }
            else if(i==3){
                return 'D'
            }
            else{
                return ''
            }
        }
    }
    processNewLine=(text)=>{
        let newText = text.split ('\n').map ((item, i) => <p>{item}</p>)
        return newText
    }
    render() {
        const renderQuestion=(text)=>{
            console.log(text)
            var arr = this.processNewLine(text)
            console.log(arr[0].props.children)
            return(
                arr.map(l=>{
                    return(
                        <p>{l.props.children}</p>
                    )
                })
            )
        }
        console.log(this.state)
        return ( 
            <React.Fragment>
                {/* Lower part */}
                <Grid container direction='row' justify='center' style={{fontFamily: 'Nunito'}}>
                    {/* Question number */}
                    <Grid item xs={12} ><div style={{textAlign: 'center',marginTop: 30, fontFamily: 'Nunito',fontSize: 22, color: '#515154', letterSpacing: 1}} >QUESTION {this.props.questionNumber} </div></Grid>
                    <Grid item xs={9}>
                        <div style={this.styles.question} >
                            {/* Question */}
                            {this.props.question?renderQuestion(this.props.question):'--'}
                        </div>
                    </Grid>


                    <Grid item xs={12}></Grid>      {/* For spacing */}


                    {/* Rendering the options */}
                    <Grid container direction='row' justify='center'>
                        <Grid item xs={9}>
                        <FormControl style={{width: '100%'}} component="fieldset">
                            <RadioGroup style={{width: '100%'}} aria-label="" name="Radio" onChange={this.handleOnChange} value={this.state.val}>
                            {/* Option A */}
                            <Zoom in={true}><Paper style={this.styles.options} ><FormControlLabel value="A" control={<Radio />} label={this.props.options?this.props.options[0]:''} /></Paper></Zoom>
                            {/* Option B */}
                            <Zoom in={true} style={{transitionDelay: '50ms'}} ><Paper style={this.styles.options} ><FormControlLabel value="B" control={<Radio />} label={this.props.options?this.props.options[1]:''} /></Paper></Zoom>
                            {this.state.optionCount>2?(
                                <React.Fragment>
                                    {/* Option C */}
                                    <Zoom in={true} style={{transitionDelay: '100ms'}} ><Paper style={this.styles.options} ><FormControlLabel value="C" control={<Radio />} label={this.props.options?this.props.options[2]:''} /></Paper></Zoom>
                                    {this.state.optionCount>3?(
                                        // Option D
                                        <Zoom in={true} style={{transitionDelay: '150ms'}} ><Paper style={this.styles.options} ><FormControlLabel value="D" control={<Radio />} label={this.props.options?this.props.options[3]:''} /></Paper></Zoom>
                                    ):('')}
                                </React.Fragment>
                            ):('')}
                            </RadioGroup>
                        </FormControl>
                        </Grid>
                    </Grid>

                </Grid>
            </React.Fragment>
         );
    }
}
 
export default SectionA;