import React, { Component } from 'react';
import Header from '../../components/header';
import Editor from 'react-simple-code-editor';
import MenuItem from '@material-ui/core/MenuItem';
// import { highlight, languages } from 'prismjs';
import '../../../prism-c.css';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { TagInput } from 'reactjs-tag-input';
import { Grid, Button } from '@material-ui/core';
import Axios from 'axios';

class EditCode extends Component {
  state = {
    question: ``,
    difficulty: 'E',
    tags: [],
    tag: '',
    marks: 1,
    code: '',
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
  handleDifficulty = event => {
    this.setState({ difficulty: event.target.value });
  };
  onTagsChanged = tags => {
    this.setState({ tags });
  };
  createQuestion = () => {
    var tag = this.state.tag;
    console.log('outside', tag);
    if (tag === '') {
      console.log('inside', tag);
      tag = this.state.tags[0].displayValue;
      console.log('inside', tag);
    }
    if (
      this.state.question != '' &&
      this.state.correctAnswer != '' &&
      this.state.difficulty != ''
    ) {
      Axios.put(
        `/api/questions/${this.props.location.questionInfo.id}`,
        {
          type: 'Code',
          title: this.state.question,
          tag: tag,
          category: this.state.difficulty
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
  componentDidMount = () => {
    window.scroll(0, 0);
    Axios.get(`/api/questions/${this.props.location.questionInfo.id}`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }).then(
      res => {
        this.setState({
            question: res.data.data.title,
            difficulty: res.data.data.category,
            tag: res.data.data.tag
        });
      },
      err => alert(err.response.data.error.msg),
    );
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
  highlighting = async (code) => {
    const prism = await import('prismjs');
    const res =  prism.highlight(code, prism.languages.js);
    if(this.state.code !== res){
      this.setState({code: res});
    }
  };
  render() {
    const renderOptions = this.state.tags.map(tag => {
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
                  highlight={(code) =>{
                    this.highlighting(code);
                    return this.state.code;
                    }}
                  padding={10}
                  style={{
                    fontFamily: 'Nunito',
                    fontSize: 14,
                  }}
                />
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
                  added from the input field below the dropdown.
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

export default EditCode;