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
import NotFound from './no-results.png';
import Axios from 'axios';

class StudentList extends Component {
  state = {
    students: [1],
    filter: [],
    search: '',
    sapId: '',
    year: localStorage.getItem('year')||'',
    div: localStorage.getItem('division')||'Others',
    type: localStorage.getItem('type')||'TT1',
    yearList: [],
    typeList: [],
    divisionList: [],
    value: { min: 99999999999, max: -1 }
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
      background: '#62ce97',
      color: 'white',
      padding: '12px 50px',
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
      fontFamily: 'Nunito',
      letterSpacing: 2,
      fontSize: 22,
      color: '#797979',
    },
  };
  handleYear=event=>{
    this.setState({year: event.target.value},()=>{
      localStorage.setItem('year',event.target.value)
      this.getStudentsList()
    })
  }
  handleType=event=>{
    this.setState({type: event.target.value},()=>{
      localStorage.setItem('type',event.target.value)
      this.getStudentsList()
    })
  }
  handleDivision=event=>{
    this.setState({div: event.target.value},()=>{
      localStorage.setItem('division',event.target.value)
      this.getStudentsList()
    })
  }
  handlePrint = () => {
    // TODO Change the url
    Axios.get(`/api/generate/pdf?year=${this.state.year}&type=${this.state.type}&div=${this.state.div}`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      responseType: 'blob',
    }).then(res => {
      console.log(res);
      const blob = new Blob([res.data], { type: 'application/gzip' });
      saveAs(blob, `${this.state.type}.gz`);
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
      },()=>this.getStudentsList());
    });
  }
  getStudentsList=()=>{
    Axios.get(`/api/evaluate/responses?year=${this.state.year}&type=${this.state.type}&div=${this.state.div}`,{
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
    .then(res=>{
      var minSapId=99999999999;
      var maxSapId=-1;
      var students=[...res.data.data.students]
      students.forEach(s=>{
        minSapId=s.sapId<minSapId?s.sapId:minSapId
        maxSapId=s.sapId>maxSapId?s.sapId:maxSapId
      })
      this.setState({
        rangeMin: parseInt(minSapId),
        rangeMax: parseInt(maxSapId),
        value: {
          min: parseInt(localStorage.getItem('min'))||parseInt(minSapId),
          max: parseInt(localStorage.getItem('max'))||parseInt(maxSapId)
        },
        students: res.data.data.students,
        filter: res.data.data.students
      })
    })
  }
  render() {
    console.log(this.state);
    var delay = -50;
    var correctedCount=0
    const renderCard = this.state.filter.filter(s=>{
      return parseInt(s.sapId)>=this.state.value.min&&parseInt(s.sapId)<=this.state.value.max
    }).map(s => {
      delay = delay + 50;
      correctedCount=s.print?correctedCount+1:correctedCount
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
                  <div style={this.styles.font} >{s.sapId}</div>
                </NavLink>
                <div style={{ flexGrow: 1 }}></div>
                {/* <IconButton style={{marginRight: 20}} >
                  <MailOutlineIcon />
                </IconButton> */}
                {/* {s.print?(
                  <Button
                    style={this.styles.btn}
                    onClick={() => this.handlePrint(s._id, s.sapId)}
                  >
                    Print
                  </Button>
                ):(
                  <Button
                    onClick={() => this.handlePrint(s._id, s.sapId)}
                    disabled={!s.print}
                    style={{padding: '10px 12px'}}
                    variant='outlined'
                  >
                    Print
                  </Button>
                )} */}
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
              {/* Select Year */}
              <Grid item xs={4}>
                <InputLabel style={{marginLeft: 10, marginTop:50}} > Year </InputLabel>
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
                <InputLabel style={{marginLeft: 10, marginTop:50}} > Type </InputLabel>
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
                <InputLabel style={{marginLeft: 10, marginTop:50}} > Division </InputLabel>
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
              
              <Grid item xs={3}>
                <IconButton onClick={this.handleExcel} style={{ ...this.styles.btn1, marginTop: 10, marginBottom:20,padding: "12px 50px"}} >
                  Generate Excel
                  <MailOutlineIcon style={{marginLeft: 10}} />
                </IconButton>
              </Grid>


              <Grid item xs={3}>
                <IconButton onClick={this.handlePrint} style={{ ...this.styles.btn, marginTop: 10, marginBottom:20}} >
                  Download PDF
                  <MailOutlineIcon style={{marginLeft: 10}} />
                </IconButton>
              </Grid>

              <Grid item xs={12}>
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

              <Grid style={{marginBottom: 40}} item xs={12}>
              {this.state.rangeMax>0&&this.state.rangeMax-this.state.rangeMin>5?(
                <React.Fragment>
                  <div style={{ letterSpacing: 1, fontSize: 20, fontFamily: 'Nunito', letterSpacing: 4}} > <b>Corrected Papers : {correctedCount}</b> <span style={{opacity: '0.4'}} >(For the specified range)</span> </div>
                  <div style={{opacity: '0.8', fontFamily: 'Nunito', letterSpacing: 1}} >Note : The slider provided below can be used to filter the range of SAP IDs</div>
                  <div style={{marginBottom: 30, opacity: '0.8', fontFamily: 'Nunito', letterSpacing: 4}} >- Adjust the slider to specify the range </div>
                  <InputRange
                  step={1}
                  formatLabel={value => `${value}`}
                  maxValue={parseInt(this.state.rangeMax)}
                  minValue={parseInt(this.state.rangeMin)}
                  value={this.state.value}
                  onChange={value =>{
                      localStorage.setItem('min', value.min)
                      localStorage.setItem('max', value.max)
                      this.setState({ value })
                    }
                  } />
                </React.Fragment>
              ):(
                <div style={{ letterSpacing: 1, fontSize: 20, fontFamily: 'Nunito', letterSpacing: 4}} > <b>Corrected Papers : {correctedCount}</b></div>
              )}
              </Grid>
              {this.state.filter.length>0?renderCard:(
                <img src={NotFound} alt="No Results found"/>
              )}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default StudentList;
