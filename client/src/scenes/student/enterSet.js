import React, { Component } from 'react'
import { Grid, Select, MenuItem, Button } from '@material-ui/core'
import Axios from 'axios'

class EnterSet extends Component {
    state = { 
        sets: []
     }
    styles={
        card:{
            padding: 60,
            fontFamily: 'Nunito',
            fontSize: 28,
            letterSpacing: 6,
            color: '#797979',
            boxShadow: '#c6e0e4 2px 2px 14px',
            borderRadius: 10
        },
        inp:{
            background: '#fff',
            padding: '16px 24px',
            borderRadius: 16,
            boxShadow: '0 5px 30px 0 #d2d2d270',
            width: '100%',
            fontFamily: 'Nunito',
            margin: 10
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
        },
        font:{
            fontFamily: 'Nunito',
            fontSize: 42,
            letterSpacing: 4,
            color: '#797979'
        }
    }
    handleSet=(event)=>{
        this.setState({id: event.target.id, set: event.target.value})
    }
    componentDidMount(){
        Axios.get('/api/sets',{
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        }).then(res=>{
            this.setState({
                sets: res.data.data.sets
            })
        },err=>alert(err.response.data.error.msg))
    }
    handleNext=()=>{
        Axios.post('/api/answers',{
            "paperId": '1'
        },{
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        })
    }
    render() {
        const renderSets=this.state.sets.map(s=>{
            return(
                <MenuItem id={s.id} value={s}> {s.set} </MenuItem>
            )
        })
        return ( 
            <React.Fragment>
                <Grid container direction='row' justify='center' style={{height: '80vh'}} >
                    <Grid item xs={10}>
                    <Grid container direction='row' justify='center' style={{height: '100%'}} >
                        <Grid item xs={12}>
                            <div style={{fontSize: 42}} >SET : {this.state.set}</div>
                        </Grid>
                        <Grid item xs={6}>
                            <div style={{textAlign: 'center',...this.styles.font}} >Enter Set</div>
                            <Select
                            placeholder="Set"
                            fullWidth
                            variant='outlined'
                            style={{...this.styles.inp,padding: '2px 20px'}}
                            labelId="demo-simple-select-label"
                            value={this.state.set}
                            onChange={this.handleSet}
                            >
                            {renderSets}
                            </Select>
                            <Button style={{...this.styles.btn,margin: 10, marginTop: 100}} >Next</Button>
                        </Grid>
                    </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
         );
    }
}
 
export default EnterSet;