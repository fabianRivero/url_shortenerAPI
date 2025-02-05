// routes/userRoutes.js
import express from 'express';
import auth from '../middlewares/auth.js';
import {
  getUsers,
  getUser,
  signup,
  login,
  deleteUser,
} from '../controllers/usersController.js';

const router = express.Router();

// Rutas CRUD
router.get('/', getUsers);
router.get('/:id', getUser);                //obtener usuarios
router.post('/login', login);            // login
router.post('/signup', signup);            // signup
router.delete('/:id', [auth], deleteUser);      // borrar perfil

export default router;