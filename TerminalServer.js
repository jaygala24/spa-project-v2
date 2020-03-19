const express = require('express');
const app = express();
const server = require('http').Server(app);
const pty = require('node-pty');
const WebSocket = require('ws');
const { exec, execSync } = require('child_process');
const fs = require('fs');

app.use('/', express.static('/client/build'));
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  ws.send('Hi there, I am a WebSocket server');
  // Create Terminal
  let ptyProcess = pty.spawn('sh', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: `./code/${req.url.split('=')[1]}/`,
    env: process.env,
  });

  // // Listen on the terminal for output and send it to the client
  ptyProcess.on('data', data => {
    ws.send(JSON.stringify({ output: data }));
  });

  // Listen on the client and send any input to the terminal
  ws.on('message', message => {
    var m = JSON.parse(message);
    if (m.input) {
      ptyProcess.write(m.input);
    } else if (m.resize) {
      ptyProcess.resize(m.resize[0], m.resize[1]);
    }
  });

  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  var saveFolder = __dirname + '/code/' + req.url.split('=')[1];
  var execCmd = `gcc ${__dirname +
    '/code/' +
    req.url.split('=')[1] +
    '/main-' +
    req.url.split('=')[2] +
    '.c -o a'}`;

  function writeOutput(stderr) {
    fs.appendFile(
      saveFolder + '/output-' + req.url.split('=')[2] + '.txt',
      stderr,
      err => {
        if (err) throw err;
      },
    );
  }

  async function RunScript() {
    fs.exists(
      saveFolder + '/output-' + req.url.split('=')[2] + '.txt',
      exists => {
        if (exists) {
          fs.unlink(
            saveFolder + '/output-' + req.url.split('=')[2] + '.txt',
            function(err) {
              if (err) {
                console.error(err);
              }
            },
          );
        }
      },
    );
    let flag = 0;
    await sleep(750);
    await exec(execCmd, (error, stdout, stderr) => {
      if (error) {
        flag = 1;
        writeOutput(stderr);
        ptyProcess.kill();
      }
    });
    ptyProcess.write(
      `gcc main-${req.url.split('=')[2]}.c -o a -lm\r`,
    );
    await sleep(1000);
    await execSync(execCmd, (error, stdout, stderr) => {
      console.log(stdout);
    });
    if (flag == 0) {
      ptyProcess.write('./a\r');
    }
    ws.on('message', message => {
      ptyProcess.write('');
    });
    ptyProcess.on('data', data => {
      if (
        data.toString().trim() === '$' ||
        data
          .toString()
          .trim()
          .endsWith('$')
      ) {
        //Checking for "$" to kill the process.
        ptyProcess.kill();
      }
    });
    if (flag == 0) {
      ptyProcess.on('data', data => {
        fs.exists(
          saveFolder + '/output-' + req.url.split('=')[2] + '.txt',
          async exists => {
            if (exists) {
              var stats = fs.statSync(
                saveFolder +
                  '/output-' +
                  req.url.split('=')[2] +
                  '.txt',
              );
              var fileSizeInBytes = stats['size'];

              if (fileSizeInBytes <= 1536) {
                fs.appendFile(
                  saveFolder +
                    '/output-' +
                    req.url.split('=')[2] +
                    '.txt',
                  data.toString(),
                  err => {
                    if (err) throw err;
                  },
                );
              } else {
                ptyProcess.kill();
              }
            } else {
              fs.appendFile(
                saveFolder +
                  '/output-' +
                  req.url.split('=')[2] +
                  '.txt',
                data.toString(),
                err => {
                  if (err) throw err;
                },
              );
            }
          },
        );
      });
    }
  }

  RunScript();
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
