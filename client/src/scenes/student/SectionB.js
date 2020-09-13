import React, { Component } from 'react';
import { Grid, Button } from '@material-ui/core';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-textmate';
import { PulseLoader } from 'react-spinners';
import Axios from 'axios';

class SectionB extends Component {
  // TODO 
  /**
   * Add input and output in state
   */
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

  // TODO
  /**
   * Setup websocket here, maybe in didMount
   * code will be like :
   * ! not sure about the connection URL though, in original Terminal component is was
   * ! ws://localhost:8080/path....
   * ! as terminal server was running on 8080, but will that work after dockerisation is not clear...???
   */
  // DUMMY CODE
  componentDidMount() {
    // maybe make this global, as will need this to close it in component will unmount
    // like : window.ws = ws;

    const ws = new WebSocket(`/path?param=${this.props.studentId}`);

    ws.addEventListener('message', (event) => {
      try {
        let data = JSON.parse(event.data);
        /** 
         * data will have following
         * update state of output as :
         * it will have components: success, timeout, and stdout, stderr
         * depending on true/false of success and timeout, one can set style of output and display respective
         * message : 
         * success false and timeout true  will have both std as empty string,
         * success false and timeout false, means either compiling or execution had error which is in stderr string
         * success true will contain the output in stdout string
         */
      } catch (e) {
        console.error(e);
      }
    })
  }

  // TODO also setup component will unmount (?) and close the websocket
  // TODO closing it is important, as that will remove the socket from server's memory
  componentWillUnmount() {
    window.ws.close();
  }

  // TODO 
  /**  update following as:
    * add following in the req sent
    * add metadata as this.props.studentId
    * add code as code in state (rename program)
    * add input as input in state
  */
  // TODO set the button to disabled for 5 seconds or so, in handler, and after five seconds enable again
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
            studentId: res.data.studentId,
          });
        },
        err => alert(err.response.data.error.msg),
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
              // Always show both i/p and o/p text areas
              // TODO connect these to i/p and o/p part of state of this component
              <textarea id='inputs'></textarea>
              <textarea id='output' readOnly={true}></textarea>
              // TODO set this button to disabled for 5 seconds or so, in handler, and after five seconds enable again
              <button onClick={this.handleRunCode}></button>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default SectionB;
