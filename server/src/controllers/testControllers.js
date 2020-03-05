const User = require("../models/UserServerModels");
const bcrypt = require("bcrypt");
const userBlockchain = require("./UserBlockchainControllers");
const infoAssetBlockchain = require("./InfoAssetBlockchainControllers");
const logic = require("../service/logic");
const request = require("./RequestsBlockchainControllers");
const healthRecord = require("./HealthRecordBlockchainControllers");
const jwt = require("jsonwebtoken");
var Request = require("request");

const log = console.log;

/** REGISTER */

/** Method: get */
//okay: require log out
exports.registerRenderPage = async function (req, res, next) {
    res.render("register");
}

/** method: post */
//xong
exports.register = async function (req, res, next) {
    User.findOne({ email: req.body.email }, async (err, user) => {
        if (user == null) {
            var toDay = "";
            logic.get_today().then(function (date) {
                toDay = date;
            });
            var cardName = "";
            var personId = "";
            personId = await logic.createCardName("Patient");
            cardName = personId + "@ehr";

            await userBlockchain.addParticipant(req.body, "Patient", personId);
            await userBlockchain.isssueIdentity(personId, "Patient");
            var cardData = await userBlockchain.exportCard(cardName);
            await userBlockchain.importCard(cardName, cardData);
            await infoAssetBlockchain.addPatientInfoAsset(req.body, personId);
            bcrypt.hash(req.body.password, 10, async function (err, hash) {
                if (err) {
                    return next(err);
                }

                const user = new User();
                user.email = req.body.email;
                user.password = hash;
                user.cardName = cardName;
                user.createAt = toDay;
                user.role = "Patient";
                user.isDelete = false;
                user.save((err, result) => {
                    if (err) {
                        return res.render("annoucement-register", { err });
                    }
                    return res.redirect("/login");
                });
            });
        } else {
            var err = 'Email has been used'
            return res.render("annoucement-register", { err });
        }
    })
}

/** LOGIN */

/** method get */

//okay: can require logout
exports.renderLoginPage = async function (req, res, next) {
    res.render("login");
}

/** method post */
//xong
exports.login = async function (req, res, next) {
    User.findOne({ email: req.body.email, isDelete: false }, async function (err, user) {
        if (err) {
            return res.json({ err });
        } else if (!user) {
            return res.redirect("/login");
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result === true) {
                var data = {
                    email: user.email,
                    role: user.role,
                    createAt: user.createAt,
                    cardName: user.cardName
                };
                const token = jwt.sign(data, "!@#$%^&*()", {
                    expiresIn: 3600 //seconds
                });
                res.cookie("access_token", token, { expires: new Date(Date.now() + 3600000) });//miliseconds
                res.redirect("/home");

            } else {
                return res.redirect("/login");
            }
        });
    });
}

/** Check user authentication */
//xong
exports.checkAuthen = async function (req, res, next) {
    if (req.cookies.access_token) {
        // return next();
        try {
            var token = req.cookies.access_token;
            var tokenDecoded = jwt.verify(token, "!@#$%^&*()");
            // log(tokenDecoded);
            req.user = tokenDecoded;
            next();
        } catch (err) {
            return res.redirect("/login");
        }
    } else {
        return res.redirect("/login");
    }
}


function requiresLogout(req, res, next) {
    if (req.cookie.access_token) {
        res.json({ err: "You must be logout tn ti Login continue" });
    } else {
        next();
    }
}

//xong
exports.showOwnerInfo = async function (req, res, next) {
    var role = req.user.role;
    var cardName = req.user.cardName;
    if (role === "Patient") {
        var participantInfo = await userBlockchain.getParticipantInfo(cardName, "Patient");
        var infoAsset = await infoAssetBlockchain.getPatientInfoAsset(cardName);
        return res.render("Patient/index", {
            participant: participantInfo,
            asset: infoAsset[0]
        });
    } else if (role === "Doctor") {
        var participantInfo = await userBlockchain.getParticipantInfo(cardName, "Doctor");
        var infoAsset = await infoAssetBlockchain.getDoctorInfoAsset(cardName);
        // log(participantInfo);
        // log(infoAsset[0]);
        return res.render("Doctor/index", {
            participant: participantInfo,
            asset: infoAsset[0]
        });
    }
    return res.redirect("/login");
}

/** HEALTH RECORD */

/** Method : get */

//xong
exports.getHealthRecords = async function (req, res, next) {
    if (req.user.role === "Patient") {
        var healthRecords = await healthRecord.getAllHealthRecord(req.user.cardName);
        // log(JSON.stringify(healthRecords));
        res.render("Patient/health-record", { data: healthRecords })
    } else if (req.user.role === "Doctor") {
        var healthRecords = await healthRecord.getAllHealthRecord(req.user.cardName);
        // log(healtshRecords);
        res.render("Doctor/health-record", { data: healthRecords })
    } else
        res.redirect("/login");
}

/** Method: Post */
//xong
exports.createHealthRecord = async function (req, res, next) {
    if (req.user.role === "Doctor") {
        var heathID = await logic.createCardName("HealthRecord");
        var createAt = await logic.get_today();
        await healthRecord.createHealthRecord(req.body, req.user.cardName, heathID, createAt);
    }
    return res.redirect("/healthrecord");
}

/** Get create health record page 
 * Method: GET
*/
//xong
exports.renderCreateRecord = async function (req, res, next) {
    if (req.user.role === "Doctor") {
        res.render("Doctor/create-health-record");
    } else
        res.redirect("/healthrecord");
}

/** Method:Post */
exports.createRecordFromCRH = async function (req, res, next) {
    if (req.user.role === "Patient") {
        // await healthRecord.createHealthRecordFromCRH()
    } else {
        res.redirect("/healthrecord");
    }
}

/**REQUEST 
 * Method: GET
*/

//xong
exports.request = async function (req, res, next) {
    if (req.user.role === "Patient") {
        var allRequests = await request.getRequest(req.user.cardName);
        res.render("Patient/request", { allRequests });
    }
    else if (req.user.role === "Doctor") {
        var allRequests = await request.getRequest(req.user.cardName);
        res.render("Doctor/request", { allRequests });
    } else
        res.redirect("/login")
}
//okay
exports.renderCreateRequest = async function (req, res, next) {
    if (req.user.role === "Patient")
        res.render("Patient/create-request");
    else if (req.user.role === "Doctor")
        res.render("Doctor/create-request");
    else
        res.redirect("/login");
}


//xong
exports.createRequest = async function (req, res, next) {
    if (req.user.role === "Patient" || req.user.role === "Doctor") {
        var requestID = await logic.createCardName("Request");
        var requesterRole = req.user.role;
        var createAt = await logic.get_today();
        var owner = req.user.cardName.split("@")[0];
        // log(requestID, createAt, owner, requesterRole);
        await request.createRequest(req.user.cardName, req.body, requestID, requesterRole, createAt, owner);
        res.redirect("/request");
    } else {
        return res.redirect("login");
    }
}

//xong
exports.acceptRequest = async function (req, res, next) {
    var role = req.user.role;
    if (role === "Patient") {
        await request.patientAcceptRequest(req.user.cardName, req.body.requestID);
        return res.redirect("/request");
    } else if (role === "Doctor") {
        await request.doctorAcceptRequest(req.user.cardName, req.body.requestID);
        return res.redirect("/request");
    }
}


//xong
exports.revokeRequest = async function (req, res, next) {
    var role = req.user.role;
    if (role === "Patient") {
        await request.patientRevokeRequest(req.user.cardName, req.body.requestID);
        return res.redirect("/request");
    } else if (role === "Doctor") {
        await request.doctorRevokeRequest(req.user.cardName, req.body.requestID);
        return res.redirect("/request");
    }
}


//xong
exports.deleteRequest = async function (req, res, next) {
    if (req.user.role === "Doctor" || req.user.role === "Patient") {
        await request.deleteRequest(req.user.cardName, req.body.requestID);
        return res.redirect("/request");
    } else {
        return res.redirect("/login");
    }
}

//



//chua kiem tra
exports.CRH = async function (req, res, next) {
    if (req.user.role === "Patient") {
        var user = await userBlockchain.getParticipantInfo(req.user.cardName, "Patient");
        await Request.post("http://localhost:8080/user", { form: user }, async function (err, response, body) {
            if (err) throw err;
            var result = JSON.parse(body);
            if (result.success === true) {
                var healthId = "";
                var createAt = "";
                for (var i in result.data) {
                    healthId = await logic.createCardName("HealthRecord");
                    createAt = await logic.get_today();
                    await healthRecord.createHealthRecordFromCRH(result.data[i], req.user.cardName, healthId, createAt);
                }
                console.log("Co " + result.data.length + " record tu benh vien Cho Ray duoc them vo blockchain!")
                return res.redirect("/healthrecord");
                // return res.send("Co " + result.data.length + " record tu benh vien Cho Ray duoc them vo blockchain!")
            }
            if (result.success === false) {
                console.log(result.data);
                return res.redirect("/healthrecord");
                // res.send(result.data);
            }
        });

    } else {
        return res.redirect("/healthrecord");
    }
}

//xong
exports.renderPatientInfomation = async function (req, res, next) {
    if (req.user.role === "Doctor") {
        var patientsInfo = await infoAssetBlockchain.getPatientInfoAsset(req.user.cardName);
        res.render("Doctor/patient-information", { patientsInfo: patientsInfo });//thay doi duong dan
    } else {
        res.redirect("/home")
    }
}

//xong
exports.renderDoctorInformation = async function (req, res, next) {
    if (req.user.role === "Patient") {
        var doctorsInfo = await infoAssetBlockchain.getDoctorInfoAsset(req.user.cardName);
        res.render("Patient/doctor-information", { doctorsInfo: doctorsInfo })
    } else {
        res.redirect("/home")
    }

}


exports.redirectLogin = async function (req, res, next) {
    res.redirect("/login")
}
