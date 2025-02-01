// routes/urlRoutes.js
import express from 'express';
import {
  createURL,
  getURLs,
  getURLById,
  updateURL,
  deleteURL,
  clickShortURL,
} from '../controllers/urlController.js';

const router = express.Router();

// Rutas CRUD
router.post('/urls', createURL);         // Crear una URL
router.get('/urls', getURLs);            // Obtener todas las URLs
router.get('/urls/:id', getURLById);     // Obtener una URL por su ID
router.put('/urls/:id', updateURL);      // Actualizar una URL por su ID
router.delete('/urls/:id', deleteURL);   // Eliminar una URL por su ID
router.get('/:shortUrl', clickShortURL); //Redireccionar el url corto a la direccion del largo y aumnetar clicks

export default router;