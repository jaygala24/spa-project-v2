import path from 'path';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { MongoURI } from './config/keys';
import apiRoutes from './routes';
import { handleError, catchError } from './utils';

config({ path: 'src/config/config.env' });

const app = express();

// Connect to DB
const uri = process.env.MONGODB_URI || MongoURI;
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
      data: {
        success: true,
        message:
          'Welcome to Node.js & Express API for MERN Starter Template',
      },
    });
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
app.use(handleError);

app.use(catchError);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
