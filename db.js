require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "PetWorld",
  port: 3306,
});

function connect() {
  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL: ", err);
      console.log("20秒後嘗試重新連線...");
      setTimeout(connect, 20000);
    }
    console.log("MySQL Connected...");
  });
}

module.exports = { db, connect };
