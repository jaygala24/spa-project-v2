import React, { Component } from 'react';
import {
  Grid,
  Paper,
  Button,
  Zoom,
  InputBase,
  MenuItem,
  Select,
  FormControl,
} from '@material-ui/core';
import Axios from 'axios';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

const innerTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#bbe4ff',
    },
    secondary: {
      main: '#fff',
    },
  },
});

class Describe extends Component {
  state = {
    set: '',
    type: 'TT1',
    time: '',
  };
  styles = {
    card: {
      padding: 60,
      fontFamily: 'Nunito',
      fontSize: 28,
      letterSpacing: 6,
      color: '#797979',
      boxShadow: '#c6e0e4 2px 2px 14px',
      borderRadius: 10,
    },
    inp: {
      background: '#fff',
      padding: '16px 24px',
      borderRadius: 16,
      boxShadow: '0 5px 30px 0 #d2d2d270',
      width: '100%',
      fontFamily: 'Nunito',
      margin: 10,
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
  // false indicates Next button is not pressed
  handleTime = event => {
    // this funtion updates the values in the parent
    // arguments are Set,Type,Time
    this.props.update(
      this.state.set,
      this.state.type,
      event.target.value,
      false,
    );
    this.setState({ [event.target.id]: event.target.value });
  };
  handleSet = event => {
    this.props.update(
      event.target.value,
      this.state.type,
      this.state.time,
      false,
    );
    this.setState({ [event.target.id]: event.target.value });
  };
  handleType = event => {
    this.props.update(
      this.state.set,
      event.target.value,
      this.state.time,
      false,
    );
    this.setState({ type: event.target.value });
  };
  handleNext = () => {
    if (
      this.state.set != '' &&
      this.state.type != '' &&
      this.state.time != ''
    ) {
      // True indicates that next button is pressed
      // This value will be use to change state of description in the parent component
      this.props.update(
        this.state.set,
        this.state.type,
        this.state.time,
        true,
      );
    } else {
      alert('Input is invalid');
    }
  };
  componentDidMount() {
    this.setState({
      set: this.props.set,
      type: this.props.type || 'TT1',
      time: this.props.time,
    });
  }
  render() {
    return (
      <React.Fragment>
        <ThemeProvider theme={innerTheme}>
          <Grid
            style={{ marginTop: 40 }}
            spacing={4}
            container
            direction="row"
            justify="center"
          >
            <Grid item xs={5}>
              <Zoom in={true}>
                <Paper style={this.styles.card}>
                  <Grid container direction="row" justify="center">
                    <Grid item>
                      <form>
                        <InputBase
                          onChange={this.handleSet}
                          value={this.state.set}
                          style={this.styles.inp}
                          id="set"
                          placeholder="Set"
                        />
                        <Select
                          fullWidth
                          variant="outlined"
                          style={{
                            ...this.styles.inp,
                            padding: '2px 20px',
                          }}
                          labelId="demo-simple-select-label"
                          value={this.state.type}
                          onChange={this.handleType}
                        >
                          <MenuItem value={'TT1'}>TT1</MenuItem>
                          <MenuItem value={'TT2'}>TT2</MenuItem>
                          {/* <MenuItem value={'End Sem'}>End Sem</MenuItem> */}
                        </Select>
                        <InputBase
                          onChange={this.handleTime}
                          value={this.state.time}
                          style={this.styles.inp}
                          type="number"
                          id="time"
                          placeholder="Time Duration (Minutes)"
                        />
                      </form>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        style={{
                          ...this.styles.btn,
                          marginTop: 10,
                          width: '100%',
                        }}
                        onClick={this.handleNext}
                        variant="contained"
                        color="primary"
                      >
                        Next
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default Describe;
