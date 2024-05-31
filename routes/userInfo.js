const { db } = require("../db");
const util = require("util");
const query = util.promisify(db.query).bind(db);
const jwt = require("jsonwebtoken");
const bcypt = require("bcrypt");

async function getUserInfo(req, res) {
  console.log(req.user.id);
  const userId = req.user.id;
  try {
    const sql = "SELECT * FROM users WHERE id = ?";
    const result = await query(sql, userId);

    if (result.length > 0) {
      delete result[0].password;
      res.json(result[0]);
    } else {
      res.status(404).send("找不到使用者");
    }
  } catch (err) {
    console.error("Error querying MySQL:", err);
    res.status(500).send("伺服器錯誤");
  }
}

async function updateName(req, res) {
  const userId = req.user.id;
  const newUserName = req.body.userName;

  try {
    const sql = "UPDATE users SET userName = ? WHERE id = ?";
    await query(sql, [newUserName, userId]);

    res.status(200).send("名稱更新成功");
  } catch (err) {
    console.error("Error querying MySQL:", err);
    res.status(500).send("伺服器錯誤");
  }
}

async function updateBirthdate(req, res) {
  const userId = req.user.id;
  const newUserBirthdate = req.body.userBirthdate;

  try {
    const sql = "UPDATE users SET birthdate = ? WHERE id = ?";
    await query(sql, [newUserBirthdate, userId]);

    res.status(200).send("更新成功");
  } catch (err) {
    console.error("Error querying MySQL:", err);
    res.status(500).send("伺服器錯誤");
  }
}

async function updateEmail(req, res) {
  const userId = req.user.id;
  const newUserEmail = req.body.userEmail;

  try {
    const sql = "UPDATE users SET email = ? WHERE id = ?";
    await query(sql, [newUserEmail, userId]);

    // 重新生成 JWT
    const tokenObject = { id: userId, email: newUserEmail };
    const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);

    // 將新的 JWT 發送給客戶端
    res
      .status(200)
      .send({ message: "電子郵件更新成功", token: "JWT " + token });
  } catch (err) {
    console.error("Error querying MySQL:", err);
    res.status(500).send("伺服器錯誤");
  }
}

async function updatePassword(req, res) {
  const userId = req.user.id;
  const newPassword = req.body.userPassword;
  const hashedPassword = await bcypt.hash(newPassword, 10);

  try {
    const sql = "UPDATE users SET password = ? where id = ?";
    await query(sql, [hashedPassword, userId]);
    const tokenObject = { id: userId, email: req.user.email };
    const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
    res.status(200).send({ message: "密碼更新成功", token: "JWT " + token });
  } catch (err) {
    console.error("Error querying MySQL:", err);
    res.status(500).send("伺服器出錯請稍候再試");
  }
}

module.exports = {
  getUserInfo,
  updateName,
  updateEmail,
  updateBirthdate,
  updatePassword,
};
