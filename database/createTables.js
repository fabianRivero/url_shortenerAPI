import connection from "./connection.js";

const createTables = async function createTables() {
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS original_url (
        id VARCHAR(100) NOT NULL PRIMARY KEY UNIQUE,
        long_url VARCHAR(200) NOT NULL UNIQUE,
        short_url VARCHAR(45) NOT NULL UNIQUE,
        clicks INT NOT NULL
      )
    `);

    console.log('Tablas creadas correctamente.');
  } catch (error) {
    console.error('Error al crear las tablas:', error);
  }
}

export default createTables;