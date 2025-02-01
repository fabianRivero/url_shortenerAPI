// controllers/urlController.js
import connection from '../database/connection.js';
import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 4); // Genera IDs de 4 caracteres

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
    const { long_url } = req.body;
    const short_url = await generateUniqueId(4, "short_url");
    const clicks = 0;

  try {
    await connection.execute(
      'INSERT INTO original_url (id, long_url, short_url, clicks) VALUES (?, ?, ?, ?)',
      [id, long_url, short_url, clicks]
    );
    res.status(201).json({ message: 'URL creada correctamente.', id, short_url });
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

// Obtener una URL por su ID
export const getURLById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await connection.execute('SELECT * FROM original_url WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'URL no encontrada.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la URL:', error);
    res.status(500).json({ error: 'Error al obtener la URL.' });
  }
};

// Actualizar una URL por su ID
export const updateURL = async (req, res) => {
  const { id } = req.params;
  const { longURL, shortURL, clicks } = req.body;

  try {
    await connection.execute(
      'UPDATE original_url SET longURL = ?, shortURL = ?, clicks = ? WHERE id = ?',
      [longURL, shortURL, clicks, id]
    );
    res.status(200).json({ message: 'URL actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar la URL:', error);
    res.status(500).json({ error: 'Error al actualizar la URL.' });
  }
};

// Eliminar una URL por su ID
export const deleteURL = async (req, res) => {
  const { id } = req.params;

  try {
    await connection.execute('DELETE FROM original_url WHERE id = ?', [id]);
    res.status(200).json({ message: 'URL eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar la URL:', error);
    res.status(500).json({ error: 'Error al eliminar la URL.' });
  }
};

export const clickShortURL = async (req, res) => {
    const shortUrl  = req.params.shortUrl;
    try {
    const [rows] = await connection.execute(`SELECT * FROM original_url WHERE short_url = ?`, [shortUrl]);
    
    if (rows.length === 0) {
        return res.sendStatus(404);
    } else {
        let clicks = rows[0].clicks + 1; 
        await connection.execute(
            'UPDATE original_url SET clicks = ? WHERE short_url = ?', [clicks, shortUrl]);
        res.redirect(rows[0].long_url)
    };

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al clickar short_url.' });
    };
};