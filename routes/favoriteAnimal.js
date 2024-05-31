const { db } = require("../db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

async function saveAnimalId(req, res) {
  const userId = req.user.id;
  const animalId = req.body.animalId;
  //檢查資料庫是否有該animalID
  try {
    const checkSql =
      "SELECT * FROM userFavorites WHERE userID = ? AND animalID = ?";
    const checkResult = await query(checkSql, [userId, animalId]);
    if (checkResult.length > 0) {
      // 如果用戶已經收藏了該動物id，則取消收藏
      const deleteSql =
        "DELETE FROM userFavorites WHERE userID = ? AND animalID = ?";
      await query(deleteSql, [userId, animalId]);
      res.send("取消收藏成功");
    } else {
      //用戶還沒收藏，則收藏 (checkResult.length ＝ 0)
      const insetSql =
        "INSERT INTO userFavorites (userID, animalID) VALUE (?, ?)";
      await query(insetSql, [userId, animalId]);
      res.send("收藏成功");
    }
  } catch (err) {
    console.error("Error querying MySQL :", err);
    res.status(500).send("伺服器發生錯誤，請稍候再試");
  }
}

async function getFavorites(req, res) {
  const userId = req.user.id;

  try {
    const sql = "SELECT animalID FROM userFavorites WHERE userID = ?";
    result = await query(sql, [userId]);
    res.json(result);
  } catch (err) {
    console.error("Error querying MySQL :", err);
    res.status(500).send("伺服器發生錯誤，請稍候再試");
  }
}

module.exports = { saveAnimalId, getFavorites };
