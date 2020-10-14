import React, { Component } from 'react';
import { Grid, Button, TextareaAutosize, CircularProgress } from '@material-ui/core';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-textmate';
import { PulseLoader } from 'react-spinners';
import Axios from 'axios';

class SectionB extends Component { 
  state = {
    code: ``,
    input: '',
    output: '',
    loading: false,
    status: "Not Running",
    statusLoading: false
  };
  styles = {
    question: {
      // textAlign: 'center',
      fontFamily: 'Nunito',
      fontSize: 20,
      color: '#515154',
      letterSpacing: 1,
    },
    myPaper: {
      background: '#FFF',
      boxShadow:
        '0px 4px 4px rgba(0, 0, 0, 0.24), 0px 0px 4px rgba(0, 0, 0, 0.12)',
      zIndex: 2,
      marginTop: 10,
      fontFamily: 'Nunito',
      letterSpacing: 1,
    },
    run: {
      background: '#4880FF',
      padding: 20,
      color: '#FFF',
      borderRadius: 0,
      fontFamily: 'Nunito',
      letterSpacing: 1,
    },
    code: {
      padding: 20,
      color: '#515154',
      fontFamily: 'Nunito',
      letterSpacing: 1,
    },
    editor: {
      paddingTop: 10,
      background: '#FFF',
    },
    stdin: {
      background: '#FFF',
      borderRadius: 2,
      padding: 20,
      width: '100%',
      boxShadow: '0px 2px 4px rgba(81, 81, 84, 0.4)',
      marginTop: 20,
    },
    stdout: {
      background: '#FFF',
      borderRadius: 2,
      padding: 20,
      width: '100%',
      boxShadow: '0px 2px 4px rgba(81, 81, 84, 0.4)',
      marginBottom: 40,
    },
    btn: {
      minWidth: '150px',
      background: '#62ce97',
      color: 'white',
      padding: '12px 0px',
      fontFamily: 'Nunito',
      letterSpacing: 1,
      borderRadius: 10,
      boxShadow: '0 5px 30px 0 #62ce97',
    },
    textarea:{
      resize: "none",
      width:"100%",
      padding:"10px",
      boxSizing:"border-box",
      boxShadow:"rgba(81, 81, 84, 0.4) 0px 2px 4px",
      fontSize:"18px",
      marginBottom:"2rem"
    },
    heading:{
      display:'inline-block',
      margin:"0 0.5rem 0.5rem 0",
      fontSize:"20px",
      fontFamily:"Nunito",
    },
    btnContainer: {
      display:"flex",
      justifyContent:"flex-end",
      marginTop: "20px"
    },
    status: {
      fontWeight: "bold", 
      fontFamily: "Nunito", 
    },
  };

  baseUrl = window.location.origin.replace(/^http/,'ws').replace('3000','5000');
  studentId = localStorage.getItem('studentId');
  url = `${this.baseUrl}/${this.studentId}`;
  ws = new WebSocket(this.url);

  componentDidMount() {
    this.ws.addEventListener('message', (event) => {
      try {
        this.setState({statusLoading: false})
        let data = JSON.parse(event.data);
        let output = '';
        let status = '';
        if(data.timeout){
          output = 'Timeout!';
          status = "Error";
        } else if(data.success){
          output = data.stdout;
          status = "Success";
        } else {
          output = data.stderr.split('\n').reduce((acc,line)=>{
            line = line.replaceAll(/.*code.c: ?/g,'');
              return acc+line+'\n';
          },"");
          status = "Error";
        }
        this.setState({ output, status });
      } catch (e) {
        console.error(e);
      }
    })
  }

  componentWillUnmount(){
    this.ws.close();
  }

  handleRunCode = () => {
    var code = this.state.code;
    console.log(code);
    console.log(code.match(/\bsystem/g));
    if (code.match(/system/g)) {
      alert(
        `Code cannot be executed as it contains system commands.\nINVALID : CODE`,
      );
    } else {
      this.setState({loading: true, statusLoading: true,status: "Compiling"});

      setTimeout(() => {
        this.setState({loading: false});
      }, 5000);
      Axios.post(
        '/api/students/runProgram',
        {
          paperId: localStorage.getItem('id'),
          questionId: this.props.questionId,
          code: this.state.code,
          currentSection: 'Code',
          metadata: this.studentId,
          input: this.state.input,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      ).then(
        res => {
          console.log(res.data);
          this.setState({
            studentId: res.data.studentId,
          });
        },
        err => {alert(err.response.data.error.msg)},
      );
    }
  };

  componentDidUpdate(prevProps, PrevState) {
    if (prevProps !== this.props) {
      this.setState({
        code: this.props.selectedAnswer,
        path: this.props.showTerminal,
      });
    }
  }
  processNewLine = text => {
    let newText = text.split('\n').map((item, i) => <p>{item}</p>);
    return newText;
  };
  handleCode = val => {
    this.props.update(val);
    this.setState({ code: val, path: null });
  };
  handleInputChange = event => {
    this.setState({input: event.target.value});
  };
  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        <Grid container direction="row" justify="center">
          <Grid item xs={12}>
            <div
              style={{
                marginTop: 40,
                textAlign: 'center',
                fontFamily: 'Nunito',
                fontSize: 22,
                color: '#515154',
                letterSpacing: 1,
              }}
            >
              QUESTION {this.props.questionNumber} ({this.props.marks} m)
            </div>
          </Grid>
          <Grid item xs={9}>
            <div style={this.styles.question}>
              {this.props.question ? (
                this.processNewLine(this.props.question)
              ) : (
                  <PulseLoader
                    size={10}
                    margin={2}
                    color={'#123abc'}
                    loading={true}
                  />
                )}
            </div>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={9}>
            <div style={this.styles.myPaper}>
              <div style={{ display: 'flex' }}>
                <div style={this.styles.code}>CODE</div>
                <div style={{ flexGrow: 1 }}></div>
                {/* <Button
                  onClick={this.handleRunCode}
                  style={this.styles.run}
                >
                  RUN CODE
                </Button> */}
              </div>
            </div>
            <div>
              <AceEditor
                placeholder="// Type your code here"
                width="100%"
                mode="csharp"
                theme="textmate"
                style={{
                  marginTop: 5,
                  boxShadow: '0px 2px 4px rgba(81, 81, 84, 0.4)',
                }}
                fontSize={18}
                onChange={this.handleCode}
                value={this.props.selectedAnswer || this.state.code}
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
              />
            </div>

            {/* <div>
                        <InputBase
                            style={this.styles.stdin}
                            placeholder='INPUT'
                            multiline={true}
                            rows={5}
                        />
                        </div>
                        <div style={this.styles.myPaper} >
                            <div>
                                <div style={this.styles.code} >OUTPUT</div>
                            </div>
                        </div>
                        <InputBase
                            style={this.styles.stdout}
                            multiline={true}
                            rows={5}
                            disabled
                            defaultValue="OUTPUT"
                        /> */}
            <div>
              <div style={this.styles.btnContainer}>
                <Button style={this.styles.btn} onClick={this.handleRunCode} disabled={this.state.loading}>Run Code</Button>
              </div>
              <h3 style={this.styles.heading} >Input:</h3>
              <TextareaAutosize id='inputs' placeholder="Enter you input" value={this.state.input} onChange={this.handleInputChange}  style={this.styles.textarea} ></TextareaAutosize>
              <h3 style={this.styles.heading} >Output: </h3> 
              <span style={{...this.styles.status, color: this.state.status === "Success" ? "green" : this.state.status === "Error" ? "red" : "inherit"}}>
                {this.state.status}  
                <CircularProgress size={18} style={{display: this.state.statusLoading ? "inline-block" : "none"}} /> 
              </span>
              <TextareaAutosize rowsMin={3} id='output' placeholder="Run code to see output here" readOnly={true} value={this.state.output} style={this.styles.textarea} ></TextareaAutosize>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default SectionB;
