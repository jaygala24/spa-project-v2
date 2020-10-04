import fs from 'fs';
import path from 'path';
import express from 'express';
import WebSocket from 'ws';
import { Server } from 'http';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import apiRoutes from './routes';
import { handleError } from './utils';
import { genHashPassword } from './utils/index';
import { User, Question } from './models';
import { saveSocket, removeSocket } from './utils/websocketMap'
import ErrorHandler from './utils/error';

config({ path: 'src/config/config.env' });

const app = express();

const server = Server(app);

// setup Web sockets
const wss = new WebSocket.Server({ server });

// TODO verify when running frontend
wss.on('connection', (ws, req) => {
  let url = req.url.split('/');
  let id = url[url.length-1];
  console.log('web socket connection request from id : ' + id); // TODO verify

  // we save the websocket mapped to the student id in map
  saveSocket(id, ws);

  // on error or closing of connection we remove the socket from the map
  ws.on('error', (err) => {
    console.error(`Removing WS id : ${id} due to error :${err}`);
    removeSocket(id);
    ws.close();
  });
  ws.on('close', (code, reason) => {
    console.log(`closing ws with id ${id} with code ${code} for reason ${reason}`);
    removeSocket(id);
  });

});


// Connect to DB
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on(
  'error',
  console.error.bind(console, 'MongoDB connection error'),
);
db.once('open', () => {
  console.log('Database connected');
});

global.__basedir = path.join(`${__dirname}`, '..');

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));

  app.get('/', (req, res, next) => {
    res.status(200).json({
      success: true,
      data: {
        message:
          'Welcome to Node.js & Express API for MERN Starter Template',
      },
    });
  });

  const users = JSON.parse(
    fs.readFileSync(`${__dirname}/users.json`, 'utf-8'),
  );

  const questions = JSON.parse(
    fs.readFileSync(`${__dirname}/questions.json`, 'utf-8'),
  );

  // Populate users from users.json file
  app.get('/populate/users', async (req, res, next) => {
    try {
      // Hashing the password of teachers
      for (let i = 0; i < users.length; i++) {
        if (users[i].password) {
          users[i].password = await genHashPassword(
            users[i].password,
          );
        }
      }
      await User.create(users);
      return res.status(200).json({
        success: true,
        data: {
          message: 'Data Imported...',
        },
      });
    } catch (err) {
      return handleError(err, res);
    }
  });

  // Flush users from the db
  app.get('/flush/users', async (req, res, next) => {
    try {
      await User.deleteMany();
      return res.status(200).json({
        success: true,
        data: {
          message: 'Data Flushed...',
        },
      });
    } catch (err) {
      return handleError(err, res);
    }
  });

  // Populate questions from questions.json file
  app.get('/populate/questions', async (req, res, next) => {
    try {
      await Question.create(questions);
      return res.status(200).json({
        success: true,
        data: {
          message: 'Data Imported...',
        },
      });
    } catch (err) {
      return handleError(err, res);
    }
  });

  // Flush questions from the db
  app.get('/flush/questions', async (req, res, next) => {
    try {
      await Question.deleteMany();
      return res.status(200).json({
        success: true,
        data: {
          message: 'Data Flushed...',
        },
      });
    } catch (err) {
      return handleError(err, res);
    }
  });
}

app.use('/api', apiRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__basedir, 'client', 'build', 'index.html'),
    ),
  );
}

// Error Handling
app.use((req, res, next) => {
  const err = new ErrorHandler(500, 'Not Found');
  handleError(err, res);
});

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
