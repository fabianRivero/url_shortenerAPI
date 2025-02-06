import express from "express";
import cors from "cors";
import createTables from "./database/createTables.js";
import urlRoutes from './routes/urlRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import dotenv from 'dotenv';

const app = express();
const PORT = 5000;
const HOST = process.env.HOST || "localhost";
dotenv.config();
app.use(cors());

app.use(express.json());

async function main() {
    await createTables(); 
    console.log('Aplicación iniciada.');
  }
  
  main().catch(console.error);

  app.get('/favicon.ico', (req, res) => res.status(204));


  app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
  });

app.get('/', (req, res) =>{
    res.status(200).send('hello');
});


app.use('/api/urls', urlRoutes);
app.use('/api/users', usersRoutes);


app.listen(process.env.PORT || PORT, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});