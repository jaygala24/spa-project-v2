import React, { Component } from 'react';
import Header from '../../components/header';
import Editor from 'react-simple-code-editor';
import MenuItem from '@material-ui/core/MenuItem';
import { highlight, languages } from 'prismjs';
import '../../../prism-c.css';
import { useAlert } from 'react-alert';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { TagInput } from 'reactjs-tag-input';
import {
  Grid,
  InputBase,
  Button,
  TextField,
} from '@material-ui/core';
import Axios from 'axios';

class CreateMcq extends Component {
  state = {
    question: ``,
    marks: 1,
    correctAnswer: 'A',
    difficulty: 'E',
    receivedTags: [],
    tags: [],
    tag: '',
    options: ['', '', '', ''],
  };
  styles = {
    font: {
      fontFamily: 'Nunito',
      fontSize: 20,
      letterSpacing: 4,
      color: '#797979',
    },
    inp: {
      background: '#fff',
      padding: '16px 24px',
      borderRadius: 16,
      boxShadow: '0 5px 30px 0 #d2d2d270',
      width: '100%',
      fontFamily: 'Nunito',
      margin: '10px 0px',
    },
    btn: {
      width: '100%',
      background: '#62ce97',
      color: 'white',
      padding: '12px 0px',
      fontFamily: 'Nunito',
      letterSpacing: 1,
      borderRadius: 10,
      boxShadow: '0 5px 30px 0 #62ce97',
    },
  };
  handleTag = event => {
    this.setState({ tag: event.target.value });
  };
  handleCorrectAnswer = event => {
    this.setState({ correctAnswer: event.target.value });
  };
  handleDifficulty = event => {
    this.setState({ difficulty: event.target.value });
  };
  onTagsChanged = tags => {
    if(tags.length > 0 ){
      this.setState({
        tag: '',
        tags
      })
    }
    else{
      this.setState({ tags })
    }
  };
  handleOptionA = event => {
    var newOptions = [...this.state.options];
    newOptions[0] = event.target.value;
    this.setState({ options: newOptions });
  };
  handleOptionB = event => {
    var newOptions = [...this.state.options];
    newOptions[1] = event.target.value;
    this.setState({ options: newOptions });
  };
  handleOptionC = event => {
    var newOptions = [...this.state.options];
    newOptions[2] = event.target.value;
    this.setState({ options: newOptions });
  };
  handleOptionD = event => {
    var newOptions = [...this.state.options];
    newOptions[3] = event.target.value;
    this.setState({ options: newOptions });
  };
  handleBtn = event => {
    if (event.target.innerHTML === '+') {
      this.setState({
        marks: this.state.marks
          ? this.state.marks + 1
          : this.state.marks + 1,
      });
    } else {
      if (this.state.marks > 1) {
        this.setState({
          marks: this.state.marks
            ? this.state.marks - 1
            : this.state.marks - 1,
        });
      }
    }
  };
  getIndexOfCorrectAnswer=(char)=>{
    if(char=='A'){
      return 0
    }
    else if(char=='B'){
      return 1
    }
    else if(char=='C'){
      return 2
    }
    else if(char=='D'){
      return 3
    }
  }
  componentDidMount = () => {
    window.scroll(0, 0);
    Axios.get('/api/questions/tags', {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }).then(
      res => {
        this.setState({ receivedTags: res.data.data.tags });
      },
      err => alert(err.response.data.error.msg),
    );
  };
  createQuestion = () => {
    var tag = this.state.tag;
    if (tag === '' && this.state.tags.length > 0) {
      tag = this.state.tags[0].displayValue;
    }
    if (
      this.state.question != '' &&
      this.state.options[0] != '' &&
      this.state.options[1] != '' &&
      this.state.options[2] != '' &&
      this.state.options[3] != '' &&
      this.state.correctAnswer != '' &&
      this.state.difficulty != '' && 
      tag != ''
    ) {
      Axios.post(
        '/api/questions',
        {
          type: 'Single',
          title: this.state.question,
          options: this.state.options,
          correctAnswers: [this.state.options[this.getIndexOfCorrectAnswer(this.state.correctAnswer)]],
          tag: tag,
          category: this.state.difficulty,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      ).then(res => {
        if (res.status == 201) {
          alert('Question added successfully');
          this.props.history.push('/manage');
        }
      });
    } else {
      alert('Please make sure all fields are valid');
    }
  };
  render() {
    console.log(this.state.options[this.getIndexOfCorrectAnswer(this.state.correctAnswer)]);
    const renderOptions = this.state.receivedTags.map(tag => {
      return <MenuItem value={`${tag}`}> {tag} </MenuItem>;
    });
    return (
      <React.Fragment>
        <Header />
        <Grid
          style={{ background: '#f3faff', height: '100vh' }}
          container
          direction="row"
          justify="center"
        >
          <Grid item xs={10}>
            <Grid
              style={{ marginTop: 40 }}
              spacing={4}
              container
              direction="row"
              justify="center"
            >
              <Grid item xs={12}>
                <div style={this.styles.font}>Enter the Question</div>
                <div
                  style={{
                    ...this.styles.font,
                    fontSize: 16,
                    letterSpacing: 1,
                  }}
                >
                  Note: The question seen by the students during the
                  test will be exactly same as the one entered below;
                  Including whitespaces and special characters
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  border: '1px #797979 solid',
                  borderRadius: 8,
                }}
              >
                <Editor
                  value={this.state.question}
                  onValueChange={question => {
                    console.log(question);
                    this.setState({ question });
                  }}
                  highlight={code => highlight(code, languages.js)}
                  padding={10}
                  style={{
                    fontFamily: 'Nunito',
                    fontSize: 14,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <div style={this.styles.font}>Options</div>
                <form>
                  <InputBase
                    value={this.state.set}
                    style={this.styles.inp}
                    onChange={this.handleOptionA}
                    id="set"
                    placeholder="Option A"
                  />
                  <InputBase
                    onChange={this.handleOptionB}
                    value={this.state.set}
                    style={this.styles.inp}
                    id="set"
                    placeholder="Option B"
                  />
                  <InputBase
                    onChange={this.handleOptionC}
                    value={this.state.set}
                    style={this.styles.inp}
                    id="set"
                    placeholder="Option C"
                  />
                  <InputBase
                    onChange={this.handleOptionD}
                    value={this.state.set}
                    style={this.styles.inp}
                    id="set"
                    placeholder="Option D"
                  />
                </form>
                <div style={this.styles.font}>Correct Answer</div>
                <FormControl>
                  <Select
                    variant="outlined"
                    style={{
                      ...this.styles.inp,
                      padding: '2px 20px',
                    }}
                    labelId="demo-simple-select-label"
                    value={this.state.correctAnswer}
                    onChange={this.handleCorrectAnswer}
                  >
                    <MenuItem value={'A'}>Option A</MenuItem>
                    <MenuItem value={'B'}>Option B</MenuItem>
                    <MenuItem value={'C'}>Option C</MenuItem>
                    <MenuItem value={'D'}>Option D</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <div style={this.styles.font}> Select a tag</div>
                <div
                  style={{
                    ...this.styles.font,
                    fontSize: 16,
                    letterSpacing: 1,
                  }}
                >
                  Note:
                  <br />
                  Tags will be used for filtering the questions.
                  Please select a tag from the dropdown below. If the
                  required tag is not available, then a new tag can be
                  added from the inout field below the dropdown.
                </div>
                <div>
                  <FormControl>
                    <Select
                      variant="outlined"
                      style={{
                        ...this.styles.inp,
                        padding: '2px 20px',
                      }}
                      labelId="demo-simple-select-label"
                      disabled={this.state.tags.length > 0}
                      value={this.state.tag}
                      onChange={this.handleTag}
                    >
                      {renderOptions}
                    </Select>
                  </FormControl>
                </div>
                <div style={{ marginTop: 80 }}>
                  <TagInput
                    wrapperStyle={`
                                        box-shadow: none;
                                        position: relative;
                                        border: 1px #797979 solid;
                                        font-family: Nunito;
                                        background: '#fff';
                                        padding: 16px 24px;
                                        border-radius: 16;
                                        box-shadow: 0 5px 30px 0 #d2d2d270;
                                        width: 98%;
                                        fontFamily: 'Nunito';
                                        margin: 10px 0px;
                                        `}
                    placeholder='Click here to add a new "Tag" only if not available above'
                    inputStyle={`
                                        &::-webkit-input-placeholder {
                                        font-family: Nunito;
                                        color: black;
                                        }
                                        `}
                    disabled={this.state.tag === ''}
                    tags={this.state.tags}
                    onTagsChanged={this.onTagsChanged}
                  />
                </div>
              </Grid>
              {/* <Grid item xs={6}>
                                <div style={this.styles.font} >Marks</div>
                                <div style={{display: 'flex',marginTop: 10}} >
                                    <div style={{flexGrow: 1}} ></div>
                                    <Button onClick={this.handleBtn} style={{...this.styles.btn, background: '#fd6f6f', boxShadow: '0 0px 4px 0 #fd6f6f', margin: 16}} color='secondary' >-</Button>
                                    <TextField onChange={this.handleMarks} variant='outlined' value={this.state.marks||this.props.marks} size='small' style={{width: 450, margin: 16}} />
                                    <Button onClick={this.handleBtn} style={{...this.styles.btn, background: '#62ce97', boxShadow: '0 0px 4px 0 #62ce97', margin: 16}} color='primary' >+</Button>
                                </div>
                            </Grid> */}
              <Grid item xs={6}>
                <div style={this.styles.font}>Difficulty</div>
                <FormControl>
                  <Select
                    variant="outlined"
                    style={{
                      ...this.styles.inp,
                      padding: '2px 20px',
                    }}
                    labelId="demo-simple-select-label"
                    value={this.state.difficulty}
                    onChange={this.handleDifficulty}
                  >
                    <MenuItem value={'E'}>Easy</MenuItem>
                    <MenuItem value={'M'}>Medium</MenuItem>
                    <MenuItem value={'H'}>Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={6}>
                <Button
                  style={{
                    ...this.styles.btn,
                    marginTop: 10,
                    marginBottom: 40,
                    width: '100%',
                  }}
                  onClick={this.createQuestion}
                  variant="contained"
                  color="primary"
                >
                  Create Question
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default CreateMcq;
