import React, { Component } from 'react'
import { Grid, Button } from '@material-ui/core';

class StartTest extends Component {
    state = { 
        set: 'A'
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
    render() { 
        return ( 
            <React.Fragment>
                <Grid container direction='row' justify='center' style={{height: '80vh'}} >
                    <Grid item xs={10}>
                        <Grid container direction='row' justify='center' style={{height: '100%'}} >
                            <Grid item xs={12}>
                                <div> <b>Note</b> : Please confirm your SET and then click on 'START TEST' button.</div>
                                <div>If the SET is incorrect, then inform the invigilator.</div>
                                <div> <b>DO NOT PROCEED IF THE SET IS INCORRECT</b> </div>
                            </Grid>
                            <Grid item xs={10}>
                                <Button onClick={()=>window.location='/section-a'} style={{...this.styles.btn,margin: 10, marginTop: 100}} >Start Test</Button>
                            </Grid>
                            <Grid style={{marginTop: 100}}  item xs={10}>
                                <Button onClick={()=>window.location='/student'} style={{...this.styles.btn, background: '#ce6262', boxShadow: '0 5px 30px 0 #ce6262',margin: 10, marginTop: 100}} >Incorrect SET</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
         );
    }
}
 
export default StartTest;