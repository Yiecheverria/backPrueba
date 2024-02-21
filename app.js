import express from 'express';
import morgan from 'morgan';
import rutas from './src/routes/rutas.js'


const app = express();


app.use(morgan('dev'));
app.use(express.json());

app.use('/prueba', rutas)

export default app;


