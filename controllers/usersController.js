// controllers/urlController.js
import connection from '../database/connection.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function validatePassword(password) {
    return password.length >= 8; 
  };

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
      const [rows] = await connection.execute('SELECT * FROM users');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios.' });
    }
};

// Obtener usuario por ID
export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await connection.execute(`SELECT * FROM users WHERE id = ?`, [id]);
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ error: 'Error al obtener usuario.' });
    }
};

//para el signup del usuario
export const signup = async (req, res) =>{
    try {
        let exists;
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }
    
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long." });
        }

        const [rows] = await connection.execute(`SELECT * FROM users WHERE email = ?`, [email]);
        exists = rows.length > 0;

        if (exists) return res.status(400).send('User already registered.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await connection.execute(
            'INSERT INTO users (email, name, password) VALUES (?, ?, ?)',
            [email, name, hashedPassword]
          );
          res.status(201).json({ message: 'user created.', email, name });

    } catch (error) {
        res.status(500).json({error: "Something went wrong", details: error.message});
    }
};

// para login de un usuario
export const login = async(req, res) =>{
    let exists;
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    const [rows] = await connection.execute(`SELECT * FROM users WHERE email = ?`, [email]);
    exists = rows.length > 0;

    if (!exists) return res.status(400).send('invalid email or password.');

    let validPassword = await bcrypt.compare(password, rows[0].password);

    if (!validPassword) return res.status(400).send("Invalid email or password.");

    try {
        const token = jwt.sign({
            id: rows[0].id,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        

        res.header("Authorization", token).send({
            user: {
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
            },
            token,
        });
        
    } catch (error) {
        res.status(500).json({error: "Somthin went wrong", details: error.message});
    }
};

// Eliminar cuenta de usuario
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: "You can only delete your own account." });
    }

    try {
        const [user] = await connection.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({
            message: 'Usuario eliminado correctamente.',
            deletedUserId: id,
        });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario.' });
    }
};