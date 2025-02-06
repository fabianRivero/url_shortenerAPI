import express from "express";
import cors from "cors";
import createTables from "./database/createTables.js";
import urlRoutes from './routes/urlRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function main() {
  await createTables();
  console.log('Tablas creadas correctamente.');
}
  
  main().catch(console.error);

import connection from './database/connection.js';  // Ruta al archivo de conexión

async function testDatabaseConnection() {
    try {
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

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


app.use('/api/urls', urlRoutes);
app.use('/api/users', usersRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});