
const User = require("../models/UserServerModels");
const JwtStrategy = require('passport-jwt').Strategy;

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) token = req.cookies.access_token;
    return token;
};
module.exports = function (passport) {
    var opts = {};
    // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");// server sẽ giải mã jwt để lấy các thông tin mà mình đã ký
    opts.jwtFromRequest = cookieExtractor;
    // opts.secretOrKey = config.secret;
    opts.secretOrKey = "!@#$%^&*()";
    // console.log(opts);
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        console.log(jwt_payload);
        // var query = "select * from users where email = '" + jwt_payload.email + "'";
        User.findOne({ email: jwt_payload.email }, async (err, user) => {
            if (err) {
                done(err, false);
            } else if (!user) {
                done(null, false);
            } else {
                return done(null, user);
            }
        })

    }));

    passport.serializeUser(function (user, done) {
        done(null, user.email);
    });

    passport.deserializeUser(function (email, done) {
        // var query = "select * from users where email = '" + email + "'";
        User.findOne({ email: email }, async function (err, user) {
            if (err) {
                return done(err, false);
            } else if (!user) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        });

    });

};
