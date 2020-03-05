const express = require("express");
const router = express.Router();
const test = require("../controllers/testControllers");
const { validator } = require("../validators/validator");

router.get("/", test.redirectLogin)
//regiter
router.get("/register", test.registerRenderPage); //okay
router.post("/register", validator, test.register);//okay

//login
router.get("/login", test.renderLoginPage);//okay
router.post("/login", test.login);//okay

//home
router.get("/home", test.checkAuthen, test.showOwnerInfo);//emergency contact? add : okay

//health record
router.get("/healthrecord", test.checkAuthen, test.getHealthRecords);
router.get("/healthrecord/create", test.checkAuthen, test.renderCreateRecord);
router.post("/healthrecord/create", test.checkAuthen, test.createHealthRecord);//neu Neurological Assessment chon 1 thi loi, chon 2 thi khong loi
router.get("/healthrecord/CRH", test.checkAuthen, test.CRH);
//request
router.get("/request", test.checkAuthen, test.request);//okay
router.get("/request/create", test.checkAuthen, test.renderCreateRequest);//okay
router.post("/request/create", test.checkAuthen, test.createRequest);//okay: chi con res.send
router.post("/request/accept", test.checkAuthen, test.acceptRequest);
router.post("/request/revoke", test.checkAuthen, test.revokeRequest);
router.post("/request/delete", test.checkAuthen, test.deleteRequest);
router.get("/patient", test.checkAuthen, test.renderPatientInfomation);//okay
router.get("/doctor", test.checkAuthen, test.renderDoctorInformation);////okay


module.exports = router;