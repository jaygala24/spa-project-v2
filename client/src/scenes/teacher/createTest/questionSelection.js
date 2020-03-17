import React, { Component } from 'react';
import { Grid, Paper, Button, Checkbox, Select, MenuItem } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { highlight, languages } from 'prismjs';
import Editor from 'react-simple-code-editor';
import NumericInput from 'react-numeric-input';
import Axios from 'axios';

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

class SelectQuestions extends Component {
    state = {
        filter: 'All',
        receivedTags: [],
        questions: [
            {
              "options": [
                "1",
                "2",
                "No Limit",
                "Depends on Compiler"
              ],
              "correctAnswers": [
                "1"
              ],
              "_id": "5e66664fc959da44e786487c0",
              "type": "Single",
              "title": "How many main() function we can have in our project?",
              "tag": "compiler",
              "category": "E",
              "__v": 0,
              "checked": false
            },
            {
              "options": [
                "Java",
                "PHP",
                "C",
                "Visual Basic"
              ],
              "correctAnswers": [
                "C"
              ],
              "_id": "5e66664fc959da44e786487e9",
              "type": "Single",
              "title": "Which programming language is more faster among these?\n1\n22\n333",
              "tag": "pattern-printing",
              "category": "E",
              "__v": 0,
              "checked": false
            },
            {
                "options": [
                  "1",
                  "2",
                  "No Limit",
                  "Depends on Compiler"
                ],
                "correctAnswers": [
                  "1"
                ],
                "_id": "5e66664fc959da44e786487c8",
                "type": "Single",
                "title": "How many main() function we can have in our project?",
                "tag": "function",
                "category": "E",
                "__v": 0,
                "checked": false
              },
              {
                "options": [
                  "Java",
                  "PHP",
                  "C",
                  "Visual Basic"
                ],
                "correctAnswers": [
                  "C"
                ],
                "_id": "5e66664fc959da44e786487e7",
                "type": "Single",
                "title": "Which programming language is more faster among these?\n1\n22\n333",
                "tag": "pattern-printing",
                "category": "E",
                "__v": 0,
                "checked": false
              },
              {
                "options": [
                  "1",
                  "2",
                  "No Limit",
                  "Depends on Compiler"
                ],
                "correctAnswers": [
                  "1"
                ],
                "_id": "5e66664fc959da44e786487c6",
                "type": "Single",
                "title": "How many main() function we can have in our project?",
                "tag": "compiler",
                "category": "E",
                "__v": 0,
                "checked": false
              },
              {
                "options": [
                  "Java",
                  "PHP",
                  "C",
                  "Visual Basic"
                ],
                "correctAnswers": [
                  "C"
                ],
                "_id": "5e66664fc959da44e786487e5",
                "type": "Single",
                "title": "Which programming language is more faster among these?\n1\n22\n333",
                "tag": "pattern-printing",
                "category": "E",
                "__v": 0,
                "checked": false
              },
              {
                "options": [
                  "1",
                  "2",
                  "No Limit",
                  "Depends on Compiler"
                ],
                "correctAnswers": [
                  "1"
                ],
                "_id": "5e66664fc959da44e786487c4",
                "type": "Single",
                "title": "How many main() function we can have in our project?",
                "tag": "compiler",
                "category": "E",
                "__v": 0,
                "checked": false
              },
              {
                "options": [
                  "Java",
                  "PHP",
                  "C",
                  "Visual Basic"
                ],
                "correctAnswers": [
                  "C"
                ],
                "_id": "5e66664fc959da44e786487e3",
                "type": "Single",
                "title": "Which programming language is more faster among these?\n1\n22\n333",
                "tag": "pattern-printing",
                "category": "E",
                "__v": 0,
                "checked": false
              },
              {
                "options": [
                  "1",
                  "2",
                  "No Limit",
                  "Depends on Compiler"
                ],
                "correctAnswers": [
                  "1"
                ],
                "_id": "5e66664fc959da44e786487c2",
                "type": "Single",
                "title": "How many main() function we can have in our project?",
                "tag": "compiler",
                "category": "E",
                "__v": 0,
                "checked": false
              },
              {
                "options": [
                  "Java",
                  "PHP",
                  "C",
                  "Visual Basic"
                ],
                "correctAnswers": [
                  "C"
                ],
                "_id": "5e66664fc959da44e786487e1",
                "type": "Single",
                "title": "Which programming language is more faster among these?\n1\n22\n333",
                "tag": "pattern-printing",
                "category": "E",
                "__v": 0,
                "checked": false
              }
        ]
     }
    styles={
        card:{
            padding: 40,
            borderRadius: 8,
            boxShadow: '0 3px 20px 0 rgba(0,0,0,.1)'
        },
        seperator:{
            padding: 10,
            borderBottom: '1px solid #a9a9a9'
        },
        type:{
            padding: 10
        },
        total:{
            padding: 10,
            fontFamily: 'Nunito',
            letterSpacing: 2
        },
        font:{
            fontFamily: 'Nunito',
            letterSpacing: 1
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
        }
    }
    trimContent=(text)=>{
        var arr=text.split(' ')
        var str=''
        if(arr.length>8){
            for(var i=0;i<8;i++){
                str=str+arr[i]+' '
            }
            return str
        }
        else{
            return text
        }
    }
    check=(id)=>{
        console.log(id)
        var newQuestions=[...this.state.questions]
        let obj = newQuestions.find((o, i) => {
            if (o._id === id) {
                newQuestions[i] = { ...o, checked: !o.checked }
                return true // stop searching
            }
        });

        this.setState({questions: newQuestions})
    }
    handleFilter=(event)=>{
        this.setState({filter: event.target.value})
    }
    componentDidMount=()=>{
        window.scroll(0,0)
        Axios.get('/api/questions', {
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        }).then(
            res=>{
                var newQuestions=[...res.data.data.questions]
                var count=res.data.data.count
                for(var i=0;i<count;i++){
                    newQuestions[i]={
                        ...newQuestions[i],
                        "checked": false,
                        "marks": 1
                    }
                }
                console.log(newQuestions)
                this.setState({
                    receivedTags: ['All',...res.data.data.tags],
                    questions: newQuestions
                })
            }
        ,err=>console.log(err))
    }
    generateReq=()=>{
        var temp=[...this.state.questions]
        var array=temp.filter(i=>i.checked)
        var mcq=[]
        var code=[]
        array.forEach(i=>{
            var obj={
                "questionId": i._id,
                "marks": i.marks
            }
            if(i.type=="Single"){
                mcq.push(obj)
            }
            else if(i.type=="Code"){
                code.push(obj)
            }
        })

        var d = new Date()

        var body={
            "set": "A",
            "type": "TT1",
            "time": 3600,
            "mcq": mcq,
            "code": code,
            "year": d.getFullYear()
        }
        return body
    }
    render() {
        console.log(this.generateReq())
        const renderOptions=this.state.receivedTags.map(tag=>{
            return(
                <MenuItem value={`${tag}`}> {tag} </MenuItem>
            )
        })
        const renderSelected=this.state.questions.filter(q=>q.checked).map(question=>{
            return(
                <Paper style={{ marginTop: 10, marginBottom: 10, padding: 10}} >
                    <div style={{display: 'flex'}} >
                        {this.trimContent(question.title)}
                        <div style={{flexGrow: 1}} ></div>
                    </div>
                    <NumericInput onChange={(val)=>{
                        var newQuestions=this.state.questions
                        let obj = newQuestions.find((o, i) => {
                            if (o._id === question._id) {
                                newQuestions[i] = { ...o, marks: val }
                                return true // stop searching
                            }
                        });
                        this.setState({questions: newQuestions})
                    }} 
                    size={1} min={1} max={100} value={parseInt(question.marks)}/>
                </Paper>
            )
        })
        const renderQuestions=this.state.questions.filter(q=>{
            if(this.state.filter!=='All'){
                return q.tag==this.state.filter
            }
            else{
                return true
            }
        }).map(question=>{
            return(
                <Paper onClick={()=>this.check(question._id)} style={{padding: 10, marginTop: 10, marginBottom: 10, display: 'flex'}} >
                    <Checkbox
                        edge="start"
                        checked={question.checked}
                        onClick={()=>this.check(question._id)}
                    />
                    <Editor
                        value={question.title}
                        onValueChange={()=>{}}
                        disabled
                        highlight={code => highlight(code, languages.js)}
                        padding={10}
                        style={{
                        fontFamily: 'Nunito',
                        fontSize: 14
                        }}
                    />
                </Paper>
            )
        })
        return (
            <React.Fragment>

                <Select
                variant='outlined'
                style={{...this.styles.inp,padding: '0px 10px', width: 220}}
                value={this.state.filter}
                onChange={this.handleFilter}
                >
                    {renderOptions}
                </Select>
                <Button variant='outlined' onClick={this.props.goBack}> Go to previous step</Button>
                <Button variant='outlined' onClick={this.props.goBack}> Submit</Button>
                <Grid style={{marginTop: 10}} spacing={4} container direction='row' justify='center'>

                    {/* Left side */}
                    <Grid item xs={5} style={{height: '70vh', overflow: 'scroll'}} >
                        {renderQuestions}
                    </Grid>

                    {/* Right side */}
                    <Grid item xs={5} style={{height: '70vh', overflow: 'scroll'}} >
                        <div>Selected Questions</div>
                        {renderSelected}
                    </Grid>
                </Grid>

            </React.Fragment>
         );
    }
}
 
export default SelectQuestions;