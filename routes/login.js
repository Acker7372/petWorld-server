const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { db } = require("../db");
const jwt = require("jsonwebtoken");

function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let sql = `SELECT * FROM users WHERE email = ${db.escape(req.body.email)}`;
  db.query(sql, async (err, result) => {
    if (err) {
      console.error("Error querying MySQL: ", err);
      return res.status(500).send("Server error");
    }
    if (
      result.length > 0 &&
      (await bcrypt.compare(req.body.password, result[0].password))
    ) {
      const tokenObject = { id: result[0].id, email: result[0].email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      delete result[0].password;
      res.send({ message: "成功登入", token: "JWT " + token, user: result[0] });
    } else {
      res.status(400).send("信箱或密碼錯誤，請檢查");
    }
  });
}

module.exports = [
  body("email").notEmpty().withMessage("請輸入Email"),
  body("password").notEmpty().withMessage("請輸入密碼"),
  login,
];
