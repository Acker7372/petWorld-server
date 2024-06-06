const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
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
