// controllers/urlController.js
import connection from '../database/connection.js';
import { customAlphabet } from 'nanoid';
import validator from 'validator'; 
const { isURL } = validator; 

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 4); 

async function generateUniqueId(len, element) {
    let id;
    let exists;
    do {
      id = nanoid(len);
      const [rows] = await connection.execute(`SELECT * FROM original_url WHERE ${element} = ?`, [id]);
      exists = rows.length > 0;
    } while (exists);
    return id;
};

// Crear una nueva URL
export const createURL = async (req, res) => {
    const id = await generateUniqueId(10, "id");
    const { long_url, userId } = req.body;
    if (!isURL(long_url)) {
      return res.status(400).json({ error: 'La URL proporcionada no es válida.' });
    };
    const generate = await generateUniqueId(4, "short_url");
    const short_url = generate; 
    const clicks = 0;

  try {
    await connection.execute(
      'INSERT INTO original_url (id, long_url, short_url, clicks, userId) VALUES (?, ?, ?, ?, ?)',
      [id, long_url, short_url, clicks, userId]
    );
    res.status(201).json({ message: 'URL creada correctamente.', id, short_url, userId });
  } catch (error) {
    console.error('Error al crear la URL:', error);
    res.status(500).json({ error: 'Error al crear la URL.' });
  }
};

// Obtener todas las URLs
export const getURLs = async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM original_url');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener las URLs:', error);
    res.status(500).json({ error: 'Error al obtener las URLs.' });
  }
};

// Obtener una URL por ID de usuario
export const getURLsByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await connection.execute('SELECT long_url, short_url, clicks FROM original_url WHERE userId = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener la URL:', error);
    res.status(500).json({ error: 'Error al obtener la URL.' });
  }
};


//clickar URL corta
export const clickShortURL = async (req, res) => {
  const shortCode = req.params.shortUrl;
  
  try {
    const [rows] = await connection.execute(`SELECT * FROM original_url WHERE short_url = ?`, [shortCode]);

    if (rows.length === 0) {
        return res.sendStatus(404);
    }

    let clicks = rows[0].clicks + 1;
    await connection.execute(
        'UPDATE original_url SET clicks = ? WHERE short_url = ?', [clicks, shortCode]
    );
    res.redirect(rows[0].long_url);

  } catch (error) {
    console.error('Error en clickShortURL:', error);
    res.status(500).json({ error: 'Error al clickar short_url.' });
  }
};
