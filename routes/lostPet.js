const { db } = require("../db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

async function saveLostPet(req, res) {
  const userId = req.user.id;
  const petInfo = JSON.parse(req.body.petInfo);
  petInfo.petImage = req.petImage;
  const sql =
    "INSERT INTO lostPets (userID, petName, petType, petBreed, petColor, lostDate, lostArea, lostAddress, contactNumber, notes, petImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  try {
    await query(sql, [
      userId,
      petInfo.petName,
      petInfo.petType,
      petInfo.petBreed,
      petInfo.petColor,
      petInfo.lostDate,
      petInfo.lostArea,
      petInfo.lostAddress,
      petInfo.contactNumber,
      petInfo.notes,
      petInfo.petImage,
    ]);
    res
      .status(200)
      .send({ message: "Lost pet information saved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error saving lost pet information." });
  }
}

async function getLostPetsByUser(req, res) {
  const userId = req.user.id;
  const sql = "SELECT * FROM lostPets WHERE userID = ?";
  try {
    const result = await query(sql, userId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error querying lost pet information." });
  }
}

async function getAllLostPets(req, res) {
  const sql = "SELECT * FROM lostPets";
  try {
    const result = await query(sql);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error querying lost pet information." });
  }
}

async function deleteLostPet(req, res) {
  const userId = req.user.id;
  const petId = req.params.petId;
  const sql = "DELETE FROM lostPets WHERE id = ?";
  try {
    await query(sql, [petId]);
    res
      .status(200)
      .send({ message: "Lost pet information deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting lost pet information." });
  }
}

module.exports = {
  saveLostPet,
  getLostPetsByUser,
  getAllLostPets,
  deleteLostPet,
};
