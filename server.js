import express from "express";
import cors from "cors";
import createTables from "./database/createTables.js";
import urlRoutes from './routes/urlRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import dotenv from 'dotenv';

const app = express();
const HOST = process.env.DB_HOST || "localhost";
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(cors());

app.use(express.json());

async function main() {
    await createTables(); 
    console.log('Aplicación iniciada.');
  }
  
  main().catch(console.error);

import connection from './database/connection.js';  // Ruta al archivo de conexión

async function testDatabaseConnection() {
    try {
        // Realiza una consulta simple para verificar la conexión
        const [rows, fields] = await connection.execute('SELECT 1');
        console.log('Conexión a la base de datos exitosa');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
    }
}

testDatabaseConnection();


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


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});