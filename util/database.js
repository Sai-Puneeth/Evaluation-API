const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'creator_assessment',
    password: '7989111050'
});

module.exports = pool.promise();