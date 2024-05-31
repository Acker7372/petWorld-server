const router = require("express").Router();
const passport = require("passport");
const register = require("./register");
const login = require("./login");
const userInfo = require("./userInfo");
const favoriteAnimal = require("./favoriteAnimal");
const lostPet = require("./lostPet");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/register", register);
router.post("/login", login);

//userInfo
router.get(
  "/userInfo",
  passport.authenticate("jwt", { session: false }),
  userInfo.getUserInfo
);

router.patch(
  "/userInfo/updateName",
  passport.authenticate("jwt", { session: false }),
  userInfo.updateName
);

router.patch(
  "/userInfo/updateBirthdate",
  passport.authenticate("jwt", { session: false }),
  userInfo.updateBirthdate
);

router.patch(
  "/userInfo/updateEmail",
  passport.authenticate("jwt", { session: false }),
  userInfo.updateEmail
);

router.patch(
  "/userInfo/updatePassword",
  passport.authenticate("jwt", { session: false }),
  userInfo.updatePassword
);

//favoriteAnimal
router.post(
  "/favoriteAnimal",
  passport.authenticate("jwt", { session: false }),
  favoriteAnimal.saveAnimalId
);

router.get(
  "/favoriteAnimal",
  passport.authenticate("jwt", { session: false }),
  favoriteAnimal.getFavorites
);

//lostPet
router.post(
  "/lostPet/saveLostPet",
  passport.authenticate("jwt", { session: false }),
  upload.single("petImage"),
  lostPet.saveLostPet
);

router.get(
  "/lostPets/byUser",
  passport.authenticate("jwt", { session: false }),
  lostPet.getLostPetsByUser
);

router.get("/lostPet/allLostPets", lostPet.getAllLostPets);

router.delete(
  "/lostPet/deleteLostPet/:petId",
  passport.authenticate("jwt", { session: false }),
  lostPet.deleteLostPet
);

module.exports = router;
