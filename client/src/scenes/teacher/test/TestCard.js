import React, { Component } from 'react';
import { Paper, Grid, Button, Grow } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

class TestCard extends Component {
    state = {  }
    styles={
        card:{
            padding: 30,
            fontFamily: 'Nunito',
            fontSize: 20,
            letterSpacing: 2,
            color: '#797979',
            boxShadow: '0 3px 20px 0 rgba(0,0,0,.1)',
            borderRadius: 20
        },
        btn:{
            margin: '10px 10px 0px 0px',
            background: '#6fdcf5',
            color: 'white',
            padding: '10px 12px',
            fontFamily: 'Nunito',
            letterSpacing: 1,
            borderRadius: 10,
            boxShadow: '0 5px 16px 0 #6fdcf5'
        },
        delBtn:{
            margin: '10px 10px 0px 0px',
            background: '#f98888',
            color: 'white',
            padding: '10px 12px',
            fontFamily: 'Nunito',
            letterSpacing: 1,
            borderRadius: 10,
            boxShadow: '0 5px 16px 0 #f98888'
        },
        // styles={
        //     card:{
        //         background: '#fff',
        //         padding: 40,
        //         borderRadius: 20
        //     },
        //     btn:{
        //         width: '100%',
        //         boxShadow: 'none',
        //         background: '#62ce97',
        //         color: 'white',
        //         padding: '12px 0px',
        //         fontFamily: 'Nunito',
        //         letterSpacing: 1,
        //         borderRadius: 10,
        //         boxShadow: '0 5px 30px 0 #62ce97'
        //     }
        // }
    }
    render() { 
        return ( 
            <React.Fragment>
                <Grid item xs={10}>
                    <Grow in={true} style={this.props.delay} >
                        <Paper style={this.styles.card} >
                            <Grid container direction='row' justify='center'>
                                <Grid item xs={12} style={{fontSize: 28}} >Set : {this.props.set}</Grid>
                                <Grid item xs={12}>Type : {this.props.type}</Grid>
                                <Grid item xs={12}>Time : {this.props.time/60} min</Grid>
                                <Grid item xs={12}>
                                    <NavLink style={{textDecoration: 'none'}} to={
                                        {
                                            pathname: '/view-paper',
                                            idProp:{
                                                id: this.props.id
                                            }
                                        }
                                    }>
                                        <Button style={this.styles.btn} variant='contained' >View</Button>
                                    </NavLink>
                                    <Button onClick={()=>this.props.onDelete(this.props.id)} style={this.styles.delBtn} variant='outlined' color='primary' >Delete</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grow>
                </Grid>
            </React.Fragment>
         );
    }
}
 
export default TestCard;