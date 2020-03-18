import React, { Component } from 'react';
import Header from '../../components/header';
import { Grid } from '@material-ui/core';
import Describe from './Describe';
import SelectQuestions from './questionSelection';

class CreateTest extends Component {
    state = { 
        set: '',
        type: '',
        time: '',
        discription: true,
        stateOfQuestionsSelected: null
     }
    updateSelectedQuestions=(obj)=>{
        this.setState({stateOfQuestionsSelected: {...obj}})
    }
    updateDescription=(set,type,time,isNextPressed)=>{
        this.setState({
            set: set,
            type: type,
            time: time,
            discription: !isNextPressed
        })
    }
    render() {
        console.log(this.state)
        return ( 
            <React.Fragment>
                <Header home={!this.state.discription} />
                <Grid style={{background: '#f3faff',height: '100vh'}} container direction='row' justify='center'>
                    <Grid item xs={12}>
                        <Grid style={{marginTop: 40, width: '100%'}} spacing={4} container direction='row' justify='center'>

                            {/* If discription is true show the first page */}

                            {this.state.discription?(
                                <Describe 
                                set={this.state.set}
                                type={this.state.type}
                                time={this.state.time}
                                update={this.updateDescription} />
                            ):(
                                <SelectQuestions
                                currentState={this.state.stateOfQuestionsSelected}
                                set={this.state.set}
                                type={this.state.type}
                                time={this.state.time}
                                update={this.updateSelectedQuestions}
                                goBack={(state)=>{
                                    this.setState({
                                    set: this.state.set,
                                    type: this.state.type,
                                    time: this.state.time,
                                    stateOfQuestionsSelected: state,
                                    discription: true
                                })}
                            } />
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
         );
    }
}
 
export default CreateTest;