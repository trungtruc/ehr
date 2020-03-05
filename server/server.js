const express = require('express');
const bodyParser = require('body-parser');
// const expressValidator = require("express-validator");
const router = require("./src/routes/route");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");
// require("./src/service/passport");
// const auth = require("./src/routes/auth");

const app = express();
const PORT = 8000;
const db = mongoose.connection;

mongoose.connect("mongodb://localhost:27017/health_record", { useNewUrlParser: true }).then(() => console.log("DB connected"));
db.on('error', (err) => {
    console.log("DB connection error: ", err.message);
});

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
// app.use("/auth", auth);
app.use("/", router);



app.listen(PORT, () => { console.log("Server started on http://localhost:" + PORT) })
