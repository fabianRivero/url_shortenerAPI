import connection from "./connection.js";

const createTables = async function createTables() {
  try {

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS original_url (
        id VARCHAR(100) NOT NULL PRIMARY KEY UNIQUE,
        long_url VARCHAR(200) NOT NULL UNIQUE,
        short_url VARCHAR(45) NOT NULL UNIQUE,
        clicks INT NOT NULL,
        userId INT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Tablas creadas correctamente.');
  } catch (error) {
    console.error('Error al crear las tablas:', error);
  }
}

export default createTables;