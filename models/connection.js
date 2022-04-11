const mysql = require('mysql2/promise');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'formation_express'
});

module.exports = {
    connection: db
};