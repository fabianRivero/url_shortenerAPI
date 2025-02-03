// routes/userRoutes.js
import express from 'express';
import auth from '../middlewares/auth.js';
import {
  signup,
  login,
  updateInfo,
  deleteUser,
} from '../controllers/usersController.js';

const router = express.Router();

// Rutas CRUD
router.post('/users/login', login);            // login
router.post('/users/signup', signup);            // signup
router.patch('/users/:id', [auth], updateInfo);     // actualizar nombre y/o contraseña
router.delete('/users/:id', [auth], deleteUser);      // borrar perfil

export default router;