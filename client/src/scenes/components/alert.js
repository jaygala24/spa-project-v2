import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

class Alert extends Component {
  state = {
    open: false,
  };
  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = event => {
    var res = event.target.innerHTML;
    if (this.props.affirmative === res) {
      this.props.callback(res);
    } else {
      this.props.callback(res);
    }
    this.setState({ open: false });
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      this.setState({ open: this.props.open });
    }
  }
  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.state.open}
          TransitionComponent={this.Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {this.props.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {this.props.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              {this.props.negative}
            </Button>
            <Button onClick={this.handleClose} color="primary">
              {this.props.affirmative}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default Alert;
