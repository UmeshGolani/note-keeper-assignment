// external imports
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import 'express-async-errors'
import ejs from 'ejs';
import cors from 'cors';
import axios from 'axios'
import indexRouter from './routes/index.js'
import authRouter from './routes/auth.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import binRouter from './routes/binRoutes.js'
import archieveRouter from './routes/archieveRoutes.js';

// local imports
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import connectDB from './config/db.js'
// import routers
import noteRouter from './routes/noteRoutes.js'

dotenv.config() //configure .env
connectDB() // connect with Atlas

const app = express()


// Middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors());


// Mount Routers
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/v1/notes', noteRouter)
app.use('/api/v1/bin', binRouter)
app.use('/api/v1/archieve', archieveRouter)

app.get('/notes', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/notes');
    const notes = response.data;
    res.render('notes', { notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.render('notes', { notes: [] });
  }
});
app.get('/bin', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/bin');
    const binNotes = response.data;
    res.render('bin', { binNotes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.render('bin', { binNotes: [] });
  }
});

app.get('/archieve', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/archieve');
    const archieveNotes = response.data;
    res.render('archieve', { archieveNotes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.render('archieve', { archieveNotes: [] });
  }
});
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server is running on port ${port}`.yellow.bold))
