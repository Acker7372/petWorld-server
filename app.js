const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
require("./config/passport")(passport);
const router = require("./routes/router");

// db.connect();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/", router);

//只有登入系統的人，才能使用收藏功能及創建走失搜尋卡片

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
