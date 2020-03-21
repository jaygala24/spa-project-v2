import React, { Component } from 'react';
import NotFoundImg from '../404.png';

class NotFound extends Component {
    state = {  }
    render() { 
        return ( 
            <React.Fragment>
                <div style={{display: 'flex', justifyContent: 'center'}} >
                    <img src={NotFoundImg} alt="404 Page Not Found"/>
                </div>
            </React.Fragment>
         );
    }
}
 
export default NotFound;