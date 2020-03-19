import React, { Component } from 'react';
import Axios from 'axios';
import TestCard from './TestCard';
import Header from '../../components/header';
import { Grid } from '@material-ui/core';
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

class ViewTests extends Component {
    state = { 
        papers: []
     }
    componentDidMount(){
        Axios.get('/api/papers',{
            headers:{
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(res=>this.setState({data: res.data.data,papers: res.data.data.papers}))
    }
    deleteTest = (id)=>{
        Axios.delete(`/api/papers/${id}`,{
            headers:{
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(res=>{
            console.log(res)
            window.location.reload()
        })
    }
    render() {
        var delay = -100
        const renderPaper = this.state.papers.map(p=>{
            delay=delay+100
            return(
                <ThemeProvider theme={innerTheme}>
                <TestCard
                set={p.set}
                id={p._id}
                type={p.type}
                time={p.time}
                delay={{transitionDelay: `${delay}ms`}}
                onDelete={(id)=>this.deleteTest(id)}
                />
                </ThemeProvider>
            )
        })
        return ( 
            <React.Fragment>
                <Header />
                <Grid
                container
                direction='row'
                justify='center'
                >
                    <Grid item xs={8}>
                        <Grid
                        container
                        direction='row'
                        justify='center'
                        spacing={1}
                        style={{marginTop: 40}}
                        >
                            {this.state.papers.length?(renderPaper):('No results found')}
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
         );
    }
}
 
export default ViewTests;