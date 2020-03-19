import React, { Component } from 'react';
import Header from '../../components/header';
import { Grid, Button } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { questions } from './questions';
import QuestionCard from './QuestionCard';
import Details from './Details';
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

class ViewQuestions extends Component {
    state = {
        filter: false,
        allQuestions: [],
        selectedChips: {},
        filters: [{title: 'Single'},{title: 'Code'}],
        selectedQuestions:[],
        details: {
            open: false,
            question: null,
            correctAnswer: null,
            category: null,
            options: []
        }
     }
    componentDidMount(){
        let chips = {}
        Axios.get('/api/questions',{
            headers:{
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(res=>this.setState({allQuestions: res.data.data.questions}))
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
    handleDetailsOpen=(q,ca,c,options)=>{
        this.setState({details: {
            // ...this.state.details,
            question: q,
            correctAnswer: ca,
            category: c,
            options: options,
            open: true
        }
    })
    }
    handleDetailsClose=()=>{
        this.setState({details: {...this.state.details,open: false}})
    }
    render() {
        console.log(this.state)
        var delay = -50
        const renderChip = this.state.filters.map(c=>{
            return(
                <Chip
                    style={{padding: 20, fontSize: 16, letterSpacing: 2}}
                    key={c.title}
                    value={c.title}
                    clickable
                    color='inherit'
                    variant={this.state.selectedChips[c.title]?'default':'outlined'}
                    label={c.title}
                    onClick={this.handleClick}
                />
            )
        })

        var renderQuestion = this.state.allQuestions.filter(question=>{
            if(this.state.filter){
                return this.state.selectedChips[question.type]
            }
            else{
                return true
            }
            // return true
        }).map(q=>{
            delay=delay+50
            return(
                <QuestionCard 
                    open={this.handleDetailsOpen} 
                    checked={this.state.selectedQuestions.includes(q.id)} 
                    updateQuestions={this.updateSelectedQuestions} 
                    id={q.id} 
                    question={q.title}
                    type={q.type} 
                    correctAnswer={q.correctAnswers}
                    category={q.type}
                    options={q.options}
                    delay={{transitionDelay: `${delay}ms`}}
                />
            )
        })

        return ( 
            <React.Fragment>
                <Header />
                <ThemeProvider theme={innerTheme}>
                <Details 
                    category={this.state.details.category}
                    options={this.state.details.options}
                    correct={this.state.details.correctAnswer}
                    question={this.state.details.question}
                    open={this.state.details.open}
                    close={this.handleDetailsClose} 
                />
                <Grid
                spacing={4}
                container
                direction='row'
                justify='center'
                style={{background: '#f3faff',height: '100vh'}}
                >
                    <Grid item xs={10} >
                        <Grid style={{marginTop: 40}} spacing={4} container direction='row' justify='center'>
                            <Grid item xs={9}>
                                {renderChip}
                            </Grid>
                            <Grid item xs={9}>
                                {this.state.filter?(<Button onClick={this.clearFilter} variant='outlined' color='inherit' >Clear Filters</Button>):("")}
                            </Grid>
                            <Grid item xs={9}>
                                {renderQuestion}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </ThemeProvider>
            </React.Fragment>
         );
    }
}
 
export default ViewQuestions;