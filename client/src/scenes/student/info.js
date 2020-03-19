import React, { Component } from 'react';

class Info extends Component {
    state = {  }
    styles={
        wrapper:{
            marginLeft: 60
        },
        sapId:{
            fontFamily: 'Nunito',
            fontSize: 26,
            letterSpacing: 2,
            color: '#797979'
        },
        set:{
            fontFamily: 'Nunito',
            fontSize: 50,
            letterSpacing: 4
        },
        cheat:{
            fontFamily: 'Nunito',
            fontSize: 18,
            letterSpacing: 2,
            color: 'red'
        }
    }
    render() { 
        return ( 
            <React.Fragment>
                <div style={this.styles.wrapper} >
                    {this.props.set?(
                        <div style={this.styles.set} >SET {this.props.set}</div>
                    ):('')}
                    <div style={this.styles.sapId} >SAP ID : {this.props.sapId}</div>
                    <div style={this.styles.cheat} > {this.props.cheat>0?this.props.cheat:''} </div>
                </div>
            </React.Fragment>
         );
    }
}
 
export default Info;