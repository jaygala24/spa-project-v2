import React, { Component } from 'react';
import Header from '../../components/header';
import {
  Grid,
  InputBase,
  Paper,
  IconButton,
  Zoom,
  Button,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { NavLink } from 'react-router-dom';
import { saveAs } from 'file-saver';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import Axios from 'axios';

class StudentList extends Component {
  state = {
    students: [1],
    filter: [],
    search: '',
    sapId: '',
    year: '',
    div: 'Others',
    type: 'TT1',
    yearList: [],
    typeList: [],
    divisionList: [],
    value: ''
  };
  styles = {
    card: {
      background: '#fff',
      padding: 30,
      marginBottom: 20,
      borderRadius: 20,
      boxShadow: '0 3px 20px 0 rgba(0,0,0,.1)',
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
    btn1:{
        margin: '10px 10px 0px 0px',
        background: '#6fdcf5',
        color: 'white',
        padding: '10px 12px',
        fontFamily: 'Nunito',
        letterSpacing: 1,
        borderRadius: 10,
        boxShadow: '0 5px 16px 0 #6fdcf5'
    },
    inp: {
      background: '#fff',
      padding: '10px 24px',
      borderRadius: 16,
      boxShadow: '0 5px 30px 0 #d2d2d270',
      fontFamily: 'Nunito',
      marginBottom: 40,
      marginTop: 40,
    },
    link: {
      textDecoration: 'none',
      cursor: 'pointer',
    },
  };
  handleYear=event=>{
    this.setState({year: event.target.value},()=>{
      this.getStudentsList()
    })
  }
  handleType=event=>{
    this.setState({type: event.target.value},()=>{
      this.getStudentsList()
    })
  }
  handleDivision=event=>{
    this.setState({div: event.target.value},()=>{
      this.getStudentsList()
    })
  }
  handlePrint = (id, sapId) => {
    Axios.get(`/api/generate/pdf/${id}`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      responseType: 'blob',
    }).then(res => {
      console.log(res);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      saveAs(blob, `${sapId}.pdf`);
    });
  };
  handleExcel=()=>{
    Axios.get(`/api/generate/excel?year=${this.state.year}&type=${this.state.type}&div=${this.state.div}`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      responseType: 'blob',
    }).then(res=>{
      console.log(res)
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
      saveAs(blob, `Scores.xls`);
    },err=>alert("Please make sure that all the dropdowns have a valid input"))
  }
  search=(event)=>{
    var sapId=event.target.value
    var res=this.state.students
    var filter=[]
    if(sapId===''){
      filter=res
    }
    else{
      res.forEach(s=>{
        if(s.sapId.match(sapId)){
          filter.push(s)
        }
      })
    }
    console.log(filter)
    this.setState({search: sapId, filter: filter})
  }
  componentDidMount() {
    Axios.get('/api/evaluate/filters', {
      headers: {
        Authorization: localStorage.getItem('token')
      },
    }).then(res => {
      var d = new Date();
      this.setState({
        year: `${d.getFullYear()}`,
        yearList: res.data.data.year,
        typeList: res.data.data.type,
        divisionList: res.data.data.div
      });
    });
  }
  getStudentsList=()=>{
    Axios.get(`/api/evaluate/responses?year=${this.state.year}&type=${this.state.type}&div=${this.state.div}`,{
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
    .then(res=>{
      this.setState({
        students: res.data.data.students,
        filter: res.data.data.students
      })
    })
  }
  render() {
    console.log(this.state);
    var delay = -50;
    const renderCard = this.state.filter.map(s => {
      delay = delay + 50;
      return (
        <Grid item xs={12}>
          <Zoom in={true} style={{ transitionDelay: `${delay}ms` }}>
            <Paper style={this.styles.card}>
              <div style={{ display: 'flex' }}>
                <NavLink
                  to={{
                    pathname: 'eval-code',
                    studentProps: {
                      sapId: s.sapId,
                      set: s.set,
                      paperId: s._id
                    },
                  }}
                  style={this.styles.link}
                >
                  <div>{s.sapId}</div>
                </NavLink>
                <div style={{ flexGrow: 1 }}></div>
                {/* <IconButton style={{marginRight: 20}} >
                  <MailOutlineIcon />
                </IconButton> */}
                <Button
                  onClick={() => this.handlePrint(s.id, s.sapId)}
                  disabled={!s.print}
                  variant="outlined"
                >
                  Print
                </Button>
              </div>
            </Paper>
          </Zoom>
        </Grid>
      );
    });
    return (
      <React.Fragment>
        <Header />
        <Grid container direction="row" justify="center">
          <Grid item xs={10}>
            <Grid container direction="row" justify="center" spacing={2}>
              <Grid item xs={7}>
                <Paper style={this.styles.inp}>
                  <IconButton>
                    <SearchIcon />  
                  </IconButton>
                  <InputBase
                    value={this.state.search}
                    style={{ width: '60%' }}
                    placeholder="Search SAP ID"
                    onChange={this.search}
                  />
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <IconButton onClick={this.handleExcel} style={{ ...this.styles.btn1, marginTop: 50}} >
                  Generate Excel
                  <MailOutlineIcon style={{marginLeft: 10}} />
                </IconButton>
              </Grid>

              {/* Select Year */}
              <Grid item xs={4}>
                <InputLabel style={{marginLeft: 10}} > Year </InputLabel>
                <Select
                fullWidth
                variant="outlined"
                style={{
                  ...this.styles.inp,
                  padding: '2px 20px',
                  marginTop: 2
                }}
                labelId="demo-simple-select-label"
                value={this.state.year}
                onChange={this.handleYear}
              >
                  {this.state.yearList.map(y=><MenuItem value={y}> {y} </MenuItem>)}
              </Select>
              </Grid>

              {/* Select Type */}
              <Grid item xs={4}>
                <InputLabel style={{marginLeft: 10}} > Type </InputLabel>
                <Select
                fullWidth
                variant="outlined"
                style={{
                  ...this.styles.inp,
                  padding: '2px 20px',
                  marginTop: 2
                }}
                labelId="demo-simple-select-label"
                value={this.state.type}
                onChange={this.handleType}
              >
                  {this.state.typeList.map(t=><MenuItem value={t}> {t} </MenuItem>)}
              </Select>
              </Grid>

              {/* Select Division */}
              <Grid item xs={4}>
                <InputLabel style={{marginLeft: 10}} > Division </InputLabel>
                <Select
                fullWidth
                variant="outlined"
                style={{
                  ...this.styles.inp,
                  padding: '2px 20px',
                  marginTop: 2
                }}
                labelId="demo-simple-select-label"
                value={this.state.div}
                onChange={this.handleDivision}
              >
                  {this.state.divisionList.map(d=><MenuItem value={d}> {d} </MenuItem>)}
              </Select>
              </Grid>
              <Grid item xs={12}>
              <InputRange
              step={10}
              maxValue={60004170100}
              minValue={60004170061}
              value={this.state.value}
              onChange={value => this.setState({ value: value })} />
              </Grid>
              {this.state.filter.length>0?renderCard:'No results found'}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default StudentList;
