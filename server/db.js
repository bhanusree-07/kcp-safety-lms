const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Bhanusree123!@",
    database: "lms_db",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed", err);
        return;
    }

    console.log("MySQL Connected");
});

module.exports = db;