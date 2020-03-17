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
        discription: false
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
                        <Grid style={{marginTop: 40}} spacing={4} container direction='row' justify='center'>

                            {/* If discription is true show the first page */}

                            {this.state.discription?(
                                <Describe update={this.updateDescription} />
                            ):(
                                <SelectQuestions goBack={()=>this.setState({discription: true})} />
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
         );
    }
}
 
export default CreateTest;