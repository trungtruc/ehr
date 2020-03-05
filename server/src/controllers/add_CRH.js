const userBlockchain = require("./UserBlockchainControllers");
const infoAssetBlockchain = require("./InfoAssetBlockchainControllers");

async function a() {
    var personId = "ChoRayHospital";
    var doctorInfo = {};
    doctorInfo = {
        firstName: "CHORAYHOSPITAL",
        lastName: "CHORAYHOSPITAL",
        day: "01",
        month: "01",
        year: "2020",
        gender: "Male",
        identityCardNumber: "CHORAYHOSPITAL",
        ethnicity: "Kinh",
        nationality: "Vietnamese",
        specialist: "Cardiologist"
    }
    await userBlockchain.addParticipant(doctorInfo, "Doctor", personId);
    await userBlockchain.isssueIdentity(personId, "Doctor");
    var cardData = await userBlockchain.exportCard(personId + "@ehr");
    await userBlockchain.importCard(personId + "@ehr", cardData);
    await infoAssetBlockchain.addDoctorInfoAsset(doctorInfo, personId);
   
}

a();