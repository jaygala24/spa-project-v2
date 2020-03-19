import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';

class Confirmation extends Component {
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
        return ( 
            <React.Fragment>
                <Dialog
                    open={this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {/* <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle> */}
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus similique molestias quibusdam excepturi nobis quas architecto impedit ratione delectus aut!
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.props.close} color="primary">
                        Submit
                    </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
         );
    }
}
 
export default Confirmation;