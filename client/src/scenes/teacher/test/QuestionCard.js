import React, { Component } from 'react';
import { Paper, TextField, Button, Zoom, IconButton } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Switch from '@material-ui/core/Switch';

class QuestionCard extends Component {
    state = { 
        checked: false
     }
    styles = {
        card:{
            padding: 20,
            margin: 10,
            boxShadow: '0 3px 20px 0 rgba(0,0,0,.1)'
        },
        btn:{
            padding: 5,
            color: 'white',
            // padding: '12px 0px',
            fontFamily: 'Nunito',
            // letterSpacing: 1,
            borderRadius: 10,
            margin: 6
        }
    }
    componentDidUpdate(prevProps,prevState){
        if(this.props!==prevProps){
            this.setState({marks: this.props.marks})
        }
    }
    handleChange = name => event => {
        // let update = this.props.updateQuestions(this.props.id)
        this.setState({checked: !this.state.checked});
    };
    handleMarks=(event)=>{
        this.setState({marks: event.target.value})
    }
    handleBtn=(event)=>{
        if(event.target.innerHTML==='+'){
            this.props.updateMarks(this.props.marks+1)
            this.setState({marks: this.state.marks?this.state.marks+1:this.props.marks+1})
        }
        else{
            this.props.updateMarks(this.props.marks>1?this.props.marks-1:this.props.marks)
            this.setState({marks: this.state.marks?this.state.marks-1:this.props.marks-1})
        }
    }
    render() { 
        return ( 
            <React.Fragment>
                <Zoom in={true} style={this.props.delay} >
                <Paper style={{...this.styles.card, ...this.props.font, fontSize: 20}} >
                    Q. {this.props.question}
                    <div style={{display: 'flex',marginTop: 10}} >
                        <div style={{flexGrow: 1}} ></div>
                        <Button onClick={this.handleBtn} style={{...this.styles.btn, background: '#fd6f6f', boxShadow: '0 0px 4px 0 #fd6f6f'}} color='secondary' >-</Button>
                        <TextField disabled onChange={this.handleMarks} variant='outlined' value={this.state.marks||this.props.marks} size='small' style={{width: 50, margin: 6}} />
                        <Button onClick={this.handleBtn} style={{...this.styles.btn, background: '#62ce97', boxShadow: '0 0px 4px 0 #62ce97'}} color='primary' >+</Button>
                    </div>
                    <div style={{display: 'flex',marginTop: 10}} >
                        <div style={{flexGrow: 1}} ></div>
                        <IconButton onClick={this.props.show} style={{padding: 0, marginRight: 20}} >
                            <InfoOutlinedIcon />
                        </IconButton>
                        <div>Type : {this.props.type}</div>
                    </div>
                    {this.props.Disabletoggle?(""):(
                        <Switch
                        checked={this.props.checked}
                        onChange={this.handleChange()}
                        value="checkedA"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    )}
                </Paper>
                </Zoom>
            </React.Fragment>
         );
    }
}
 
export default QuestionCard;