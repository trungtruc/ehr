const mongoose = require("mongoose");
const userBlockchain = require("./UserBlockchainControllers");
const infoAssetBlockchain = require("./InfoAssetBlockchainControllers");
const User = require("../models/UserServerModels");
const bcrypt = require("bcrypt");

function a(from, to) {
    mongoose.connect("mongodb://localhost:27017/health_record", { useNewUrlParser: true }).then(async function() {
        var personId = "DOCTOR";
        var doctorInfo = {};
        var id = "";
        for (i = 1; i <= to - from + 1; i++) {
            doctorInfo = {
                firstName: "Doctor" + (from + i - 1).toString(),
                lastName: "Doctor" + (from + i - 1).toString(),
                day: "01",
                month: "01",
                year: "2020",
                gender: "Male",
                identityCardNumber: "123456789",
                ethnicity: "Kinh",
                nationality: "Vietnamese",
                specialist: "Cardiologist"
            }
            id = personId + (from + i - 1).toString();
            await userBlockchain.addParticipant(doctorInfo, "Doctor", id);
            await userBlockchain.isssueIdentity(id, "Doctor");
            var cardData = await userBlockchain.exportCard(id + "@ehr");
            await userBlockchain.importCard(id + "@ehr", cardData);
            await infoAssetBlockchain.addDoctorInfoAsset(doctorInfo, id);
            bcrypt.hash("123", 10, async function (err, hash) {
                if (err) {
                    console.error(err);
                }

                const user = new User();
                user.email = id + "@gmail.com";
                user.password = hash;
                user.cardName = id + "@ehr";
                user.createAt = "01/01/2020";
                user.role = "Doctor";
                user.isDelete = false;
                user.save((err, result) => {
                    if (err) {
                        console.error(err);
                    }
                    console.log("Create doctor " + id + " successfully!");
                });
            });
        }
    });
}

a(1, 10);