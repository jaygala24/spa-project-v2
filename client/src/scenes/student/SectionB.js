import React, { Component } from 'react';
import { Grid, Button } from '@material-ui/core';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-textmate';
import { PulseLoader } from 'react-spinners';
import Terminal from '../components/terminal';
import Axios from 'axios';

class SectionB extends Component {
  state = {
    code: ``,
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
  };

  handleRunCode = () => {
    var code = this.state.code;
    console.log(code);
    console.log(code.match(/\bsystem/g));
    if (code.match(/system/g)) {
      alert(
        `Code cannot be executed as it contains system commands.\nINVALID : CODE`,
      );
    } else {
      Axios.post(
        '/api/students/runProgram',
        {
          paperId: localStorage.getItem('id'),
          questionId: this.props.questionId,
          program: this.state.code,
          currentSection: 'Code',
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
            studentId: res.data.data.submittedAnswer.studentId,
            path: true, // This is th dummy variable for mounting terminal
          });
        },
        err => alert(err),
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
              QUESTION {this.props.questionNumber}
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
                <Button
                  onClick={this.handleRunCode}
                  style={this.styles.run}
                >
                  RUN CODE
                </Button>
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
              {this.state.path ? (
                <Terminal
                  studentId={this.state.studentId}
                  questionId={this.props.questionId}
                />
              ) : (
                ''
              )}
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default SectionB;
