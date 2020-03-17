import React, { Component } from 'react';
import { Paper, Grid, Zoom } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

class Card extends Component {
  styles = {
    link: {
      textDecoration: 'none',
    },
    card: {
      padding: 20,
      height: '28vh',
      fontFamily: 'Nunito',
      fontSize: 28,
      letterSpacing: 6,
      color: '#797979',
      boxShadow: '0 3px 20px 0 rgba(0,0,0,.1)',
      borderRadius: 10,
    },
  };

  render() {
    return (
      <React.Fragment>
        <NavLink
          style={this.styles.link}
          to={{
            pathname: this.props.link,
            cardProps: this.props.division,
          }}
        >
          <Zoom in={true} style={this.props.delay}>
            <Paper style={this.styles.card}>
              <Grid
                style={{ height: '100%' }}
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <Grid item>{this.props.text}</Grid>
              </Grid>
            </Paper>
          </Zoom>
        </NavLink>
      </React.Fragment>
    );
  }
}

export default Card;
