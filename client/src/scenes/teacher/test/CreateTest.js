import React, { Component } from 'react';
import Header from '../../components/header';
import { Grid, Button } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { questions } from '../../questions';
import QuestionCard from './QuestionCard';
import Confirmation from './Confirmation';

class CreateTest extends Component {
    state = {
        open: false,
        filter: false,
        allQuestions: [],
        selectedChips: {},
        filters: [{title: 'Conditional'},{title: 'Variables'}],
        selectedQuestions:[]
     }
    componentDidMount(){
        let chips = {}
        this.state.filters.forEach(f=>{
            chips = {
                ...chips,
                [f.title]: false
            }
        })
        this.setState({selectedChips: {...chips},allQuestions: questions})
    }
    handleClick=(event)=>{
        if(event.target.className=='MuiChip-label'){
            let val = event.target.parentNode.getAttribute('value')
            this.setState({selectedChips:{
                ...this.state.selectedChips,
                [val]: !this.state.selectedChips[[val]]
            },filter: this.isFilterSelected({
                ...this.state.selectedChips,
                [val]: !this.state.selectedChips[[val]]
            })})
        }
        else{
            let val = event.target.getAttribute('value')
            this.setState({selectedChips:{
                ...this.state.selectedChips,
                [val]: !this.state.selectedChips[[val]]
            },filter: this.isFilterSelected({
                ...this.state.selectedChips,
                [val]: !this.state.selectedChips[[val]]
            })})
        }
    }
    updateSelectedQuestions = (id)=>{
        let q = this.state.selectedQuestions
        if(!q.includes(id)){
            this.setState({selectedQuestions:[...q,id]})
        }
        else{
            q.splice(q.indexOf(id),1)
            this.setState({selectedQuestions: q})
        }
    }
    clearFilter=()=>{
        let chips = {}
        this.state.filters.forEach(f=>{
            chips = {
                ...chips,
                [f.title]: false
            }
        })
        this.setState({selectedChips: {...chips},filter: false})
    }
    isFilterSelected=(obj)=>{
        let keys = Object.keys(obj)
        for(var i=0;i<keys.length;i++){
            if(obj[keys[i]]===true){
                return true
            }
        }
        return false
    }
    handleConfirmationOpen=()=>{
        this.setState({open: true})
    }
    handleConfirmationClose=()=>{
        this.setState({open: false})
    }
    render() {
        console.log(this.state)
        const renderChip = this.state.filters.map(c=>{
            return(
                <Chip
                    key={c.title}
                    value={c.title}
                    clickable
                    color='primary'
                    variant={this.state.selectedChips[c.title]?'default':'outlined'}
                    label={c.title}
                    onClick={this.handleClick}
                />
            )
        })

        var renderQuestion = this.state.allQuestions.filter(question=>{
            if(this.state.filter){
                return this.state.selectedChips[question.category]
            }
            else{
                return true
            }
        }).map(q=>{
            return(
                <QuestionCard checked={this.state.selectedQuestions.includes(q.id)} updateQuestions={this.updateSelectedQuestions} id={q.id} question={q.q} type={q.type} />
            )
        })

        return ( 
            <React.Fragment>
                <Header />
                <Confirmation open={this.state.open} close={this.handleConfirmationClose} />
                <Grid
                spacing={4}
                container
                direction='row'
                justify='center'
                style={{background: '#eee',height: '100vh'}}
                >
                    <Grid item xs={10} >
                        <Grid style={{marginTop: 40}} spacing={4} container direction='row' justify='center'>
                            <Grid item xs={9}>
                                Number of questions selected: {this.state.selectedQuestions.length}
                                <span style={{marginLeft: 20}} >
                                    <Button onClick={this.handleConfirmationOpen} variant='contained' color='primary' >Submit test</Button>
                                </span>
                            </Grid>
                            <Grid item xs={9}>
                                {renderChip}
                            </Grid>
                            <Grid item xs={9}>
                                {this.state.filter?(<Button onClick={this.clearFilter} variant='outlined' color='primary' >Clear Filters</Button>):("")}
                            </Grid>
                            <Grid item xs={9}>
                                {renderQuestion}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
         );
    }
}
 
export default CreateTest;