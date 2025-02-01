import mysql from "mysql2/promise";

const connection = mysql.createPool({
    host: 'localhost', 
    user: 'fabianRivero', 
    password: 'inSERto11', 
    database: 'url_shortener', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

export default connection;