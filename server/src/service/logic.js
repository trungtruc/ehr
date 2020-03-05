var fs = require("fs");
const jwt = require("jsonwebtoken");

const log = console.log;

module.exports = { createCardName, get_today, createToken };

async function get_today() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    // console.log(today);
    return today;
}
// createCardName("Patient");
async function createCardName(role) {

    switch (role) {
        case "Patient":
            var data = fs.readFileSync('/home/daihue/ehr/server/src/service/patientCardNumber.txt', 'utf-8');
            fs.writeFileSync("/home/daihue/ehr/server/src/service/patientCardNumber.txt", parseInt(data) + 1);
            return ("PATIENT" + data);
        case "Doctor":
            var data = fs.readFileSync('/home/daihue/ehr/server/src/service/doctorCardNumber.txt', 'utf-8');
            fs.writeFileSync("/home/daihue/ehr/server/src/service/doctorCardNumber.txt", parseInt(data) + 1);
            return ("DOCTOR" + data);
        case "HealthRecord":
            var data = fs.readFileSync('/home/daihue/ehr/server/src/service/healthRecordNumber.txt', 'utf-8');
            fs.writeFileSync("/home/daihue/ehr/server/src/service/healthRecordNumber.txt", parseInt(data) + 1);
            return ("HEALTHRECORD" + data);
        case "Request":
            var data = fs.readFileSync('/home/daihue/ehr/server/src/service/requestNumber.txt', 'utf-8');
            fs.writeFileSync("/home/daihue/ehr/server/src/service/requestNumber.txt", parseInt(data) + 1);
            return ("REQUEST" + data);
    }

}
// createToken({ username: "hue", role: "Patient" });
async function createToken(user) {
    var token = jwt.sign(user, "!@#$%^&*()", {
        expiresIn: 3600 //seconds
    });
    console.log(token);
    return token;
}