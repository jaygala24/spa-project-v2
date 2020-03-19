import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { NavLink } from 'react-router-dom';
import { Grid } from '@material-ui/core';

class Details extends Component {
    state = {
        open: false
    }
    styles={
        options:{
            padding: 10,
            border: '1px solid #515154',
            borderRadius: 4,
            margin: 4
        },
        selectedOption:{
            padding: 10,
            borderRadius: 4,
            margin: 4,
            border: '1px solid #7CE493',
            color: '#7CE493'
        }
    }
    handleClickOpen = () => {
        this.setState({open:true});
    };

    handleClose = () => {
        this.setState({open:false});
    };
    render() {
        const renderOption = this.props.options.map(o=>{
            return(
                <Grid style={this.props.correct==o?(this.styles.selectedOption):(this.styles.options)} item xs={12}>
                    {o}
                </Grid>
            )
        })
        return ( 
            <React.Fragment>
                <Dialog
                    open={this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.question}
                    </DialogContentText>
                    <Grid container direction='row' justify='center'>
                        <Grid item xs={12}>
                            Category : {this.props.category}
                        </Grid>
                        {renderOption}
                    </Grid>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.props.close} color="primary">
                        Close
                    </Button>
                    <NavLink style={{textDecoration: 'none',color: 'black'}} to={{
                        pathname: 'edit-question',
                        editProps:{
                            question: this.props.question,
                            category: this.props.category,
                            correctAnswer: this.props.correct
                        }
                    }} >
                        {/* <Button onClick={this.props.close} color="primary" autoFocus>
                            Edit
                        </Button> */}
                    </NavLink>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
         );
    }
}
 
export default Details;