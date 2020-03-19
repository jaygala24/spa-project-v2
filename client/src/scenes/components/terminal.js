import React, { Component } from 'react';
import 'xterm/dist/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import * as attach from 'xterm/lib/addons/attach/attach';

Terminal.applyAddon(attach);

class Xterminal extends Component {
  async componentDidMount() {
    const ws = new WebSocket(
      `ws://localhost:8080/path?param=${this.props.studentId}=${this.props.questionId}`,
    );
    const term = new Terminal({
      cols: 80,
      rows: 24,
    });
    const fitAddon = new FitAddon();
    term.open(this.termElm);

    function sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    if (this.props.studentId) {
      // const fileName = 'gcc ./' + this.props.fileName + ' -o a\r';
      ws.addEventListener('open', async function() {
        console.info('WebSocket connected');
        // ws.send(
        //   JSON.stringify({
        //     input: fileName,
        //   }),
        // );
      });
    }

    ws.addEventListener('message', function(event) {
      console.debug('Message from server ', event.data);
      try {
        let output = JSON.parse(event.data);
        term.write(output.output);
      } catch (e) {
        console.error(e);
      }
    });
    //   term.open(document.getElementById('terminal'))

    //   term.on('resize', size => {
    //     console.debug('resize')
    //     let resizer = JSON.stringify({ resizer: [size.cols, size.rows] })
    //     ws.send(resizer)
    //   })
    // }
    term.on('data', data => ws.send(JSON.stringify({ input: data })));

    window.addEventListener('resize', () => {
      term.loadAddon(fitAddon);
    });

    term.loadAddon(fitAddon);

    term.on('resize', size => {
      console.debug('resize');
      let resizer = JSON.stringify({
        resizer: [size.cols, size.rows],
      });
      ws.send(resizer);
    });

    window.ws = ws;
  }

  componentWillUnmount() {
    window.ws.close();
  }

  render() {
    return (
      <div className="App">
        <div style={{ padding: '10px' }}>
          <div ref={ref => (this.termElm = ref)}></div>
        </div>
      </div>
    );
  }
}

export default Xterminal;
