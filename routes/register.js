const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { db } = require("../db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let hashedPassword = await bcrypt.hash(req.body.password, 10);
  let user = {
    userName: req.body.userName,
    password: hashedPassword,
    email: req.body.email,
    birthdate: req.body.birthdate,
  };
  let checkEmailSql = "SELECT email FROM users WHERE email = ?";
  try {
    const result = await query(checkEmailSql, [user.email]);
    if (result.length > 0) {
      return res.status(400).send("Email已被註冊");
    } else {
      const sql = "INSERT INTO users SET ?";
      await query(sql, user);
      res.send("註冊成功");
    }
  } catch (err) {
    console.error("Error querying MySQL: ", err);
    res.status(500).send("Server error");
  }
}

module.exports = [
  body("userName").notEmpty().withMessage("Username is required"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  body("email").notEmpty().withMessage("Email is required"),
  body("birthdate").notEmpty().withMessage("Birthdate is required"),
  register,
];
