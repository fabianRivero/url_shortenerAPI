import express from "express";
import createTables from "./database/createTables.js";
import urlRoutes from './routes/urlRoutes.js';

const app = express();
const PORT = 5000;

app.use(express.json());

async function main() {
    await createTables(); 
    console.log('Aplicación iniciada.');
  }
  
  main().catch(console.error);


app.get('/', (req, res) =>{
    res.status(200).send('hello');
});

app.use('/api', urlRoutes);

app.listen(process.env.PORT || PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});