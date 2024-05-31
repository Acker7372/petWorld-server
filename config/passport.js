let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
const { db } = require("../db");
const util = require("util");

// 將db.query包裝成一個返回Promise的函數
const query = util.promisify(db.query).bind(db);

module.exports = function (passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        const rows = await query("SELECT * FROM users WHERE id = ?", [
          jwt_payload.id,
        ]);
        if (rows.length) {
          //   console.log(rows[0]);
          return done(null, rows[0]);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
