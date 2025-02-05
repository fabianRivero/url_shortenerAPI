// routes/urlRoutes.js
import express from 'express';
import {
  createURL,
  getURLs,
  getURLsByUserId,
  clickShortURL,
} from '../controllers/urlController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Rutas CRUD
router.post('/', [auth], createURL);         // Crear una URL
router.get('/', getURLs);                    // Obtener todas las URLs
router.get('/user/:id', getURLsByUserId);    // Obtener URLs por usuario
router.get('/:shortUrl', clickShortURL);     // Redireccionar el short_url

export default router;