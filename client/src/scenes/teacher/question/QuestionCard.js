import React, { Component } from 'react';
import { Paper, Zoom, IconButton } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import { NavLink } from 'react-router-dom';
import Axios from 'axios';

class QuestionCard extends Component {
    state = { 
        checked: false
     }
    styles = {
        card:{
            padding: 40,
            margin: 10,
            fontFamily: 'Nunito',
            fontSize: 20,
            letterSpacing: 2,
            color: '#797979',
            boxShadow: '#c6e0e4 2px 2px 14px',
            borderRadius: 10
        }
    }
    handleChange = name => event => {
        // let update = this.props.updateQuestions(this.props.id)
        this.setState({checked: !this.state.checked});
    };
    processNewLine=(text)=>{
        let newText = text.split ('\n').map ((item, i) => <p>{item}</p>)
        return newText
    }
    deleteQuestion=()=>{
        Axios.delete(`/api/questions/${this.props.id}`,{
            headers:{
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(res=>window.location='/questions')
    }
    render() { 
        return ( 
            <React.Fragment>
                <Zoom in={true} style={this.props.delay}>
                <Paper style={this.styles.card} >
                   Q. {this.props.question ? this.processNewLine(this.props.question) : ""}
                    <div style={{display: 'flex',marginTop: 10}} >
                        <div style={{flexGrow: 1}} ></div>
                        {/* <div style={{letterSpacing: 6}} >{this.props.type}</div> */}
                    </div>
                    <div style={{display: 'flex',marginTop: 10}} >
                        <div style={{flexGrow: 1}} ></div>
                        <IconButton onClick={()=>this.props.open(this.props.question,this.props.correctAnswer[0],this.props.category,this.props.options)} style={{padding: 0, marginRight: 20}} >
                            <InfoOutlinedIcon />
                        </IconButton>
                        {this.props.type=='Single'?(
                            <NavLink
                            to={{
                                pathname: 'edit-question-mcq',
                                questionInfo: {
                                    id: this.props.id
                                }
                            }}
                            style={this.styles.link}
                            >
                            <IconButton style={{padding: 0, marginRight: 20}} >
                                <EditIcon />
                            </IconButton>    
                            </NavLink>
                        ):(
                            ''
                        )}
                        <IconButton onClick={this.deleteQuestion} style={{padding: 0, marginRight: 20}} >
                            <DeleteForeverIcon />
                        </IconButton>
                        <div>Type : {this.props.type}</div>
                    </div>
                </Paper>
                </Zoom>
            </React.Fragment>
         );
    }
}
 
export default QuestionCard;
