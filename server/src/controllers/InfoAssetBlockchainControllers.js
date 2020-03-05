
const chalk = require('chalk');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const log = console.log;

module.exports = {
    addDoctorInfoAsset, addPatientInfoAsset, getDoctorInfoAsset,
    getPatientInfoAssetById, getPatientInfoAsset, getDoctorInfoAssetById
};


// var data = {
//     "personID": "PATIENT2",
/* // "firstName": "patient",
//     "lastName": "patient",
//     "dateOfBirth": "patient",
//     "gender": "Male",
//     "identityCardNumber": "patient",
//     "ethnicity": "Kinh",

//     "specialist": "Cardiologist",///////////
//     
//     "address": "patient",
//     "city": "patient",
//     "state": "patient",
//     "country": "patient",
//     "home": "N_A",
//     "work": "N_A",
//     "mobile": "0987654321" */
// "marriageStatus": "Single",
//     "nationality": "patient",
//PatientDemographic
//     "firstName": "patient",
//     "lastName": "patient",
//     "dateOfBirth": "patient",
//     "gender": "Male",
//     "ethnicity": "Kinh",
//     "marital": false,
//     "address": "patient",
//     "city": "patient",
//     "state": "patient",
//     "country": "patient",
//     "languagePatient": "English",
//     "home": "patient",
//     "work": "patient",
//     "mobile": "0987654321",
//     "emergencyContact": [{
//         "emergencyContactName": "bameanhchiem",
//         "home": "N_A",
//         "work": "N_A",
//         "mobile": "0123456789",
//     }],
//     "provider": "N_A",
//     "insuranceNumber": "N_A"
// };



//okay
// addDoctorInfoAsset(data);
async function addDoctorInfoAsset(data, personID) {
    log(chalk.bgRed("Start creating a new asset doctor info"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        const definition = await businessNetworkConnection.connect('admin@ehr');
        let assetRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.DoctorInformation');
        let factory = definition.getFactory();

        let asset = factory.newResource('org.uit.ehr', "DoctorInformation", personID);
        asset.firstName = data.firstName;
        asset.lastName = data.lastName;
        asset.gender = data.gender;
        asset.ethnicity = data.ethnicity;
        asset.nationality = data.nationality;
        asset.specialist = data.specialist;
        asset.authorizedPatients = [];
        var owner = factory.newRelationship("org.uit.ehr", "Doctor", personID);
        asset.owner = owner;

        // // //add a new participant to business network
        await assetRegistry.add(asset);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Add a new doctor info asset successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
    }
}

// getDoctorInfoAsset("PATIENT5@ehr");
//okay
async function getDoctorInfoAsset(cardName) {
    log(chalk.bgRed("Start getting a doctor info asset"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect(cardName);
        let doctorInfoRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.DoctorInformation');
        var result = await doctorInfoRegistry.getAll();
        // log(result[0]);
        var info = null;
        var arr = [];
        for (var i in result) {
            info = {
                "personID": result[i].doctorInfoID,
                "firstName": result[i].firstName,
                "lastName": result[i].lastName,
                "gender": result[i].gender,
                "ethnicity": result[i].ethnicity,
                "nationality": result[i].nationality,
                "specialist": result[i].specialist
            };
            arr.push(info);
        }
        //disconect admin card
        await businessNetworkConnection.disconnect();
        // log(arr);
        log(chalk.green("getted a doctor info asset successfully"));
        return arr;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return null;
    }
}

//okay
// getDoctorInfoAssetById("DOCTOR2@ehr", "DOCTOR2");
async function getDoctorInfoAssetById(cardName, infoID) {
    log(chalk.bgRed("Start getting a doctor info asset by id: " + infoID + " with cardName: " + cardName));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect(cardName);
        let doctorInfoRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.DoctorInformation');
        var result = await doctorInfoRegistry.get(infoID);
        log(result);
        var info = null;
        info = {
            "personID": result.doctorInfoID,
            "firstName": result.firstName,
            "lastName": result.lastName,
            "gender": result.gender,
            "ethnicity": result.ethnicity,
            "nationality": result.nationality,
            "specialist": result.specialist
        };
        //disconect admin card
        await businessNetworkConnection.disconnect();
        // log(info);
        log(chalk.green("getted a doctor info asset successfully"));
        return info;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return null;
    }
}

// var data = {
//     "marriageStatus": "Single",
//     "nationality": "patient5",
//     "firstName": "patient5",
//     "lastName": "patient5",
//     "dateOfBirth": "patient5",
//     "gender": "Male",
//     "ethnicity": "Kinh",
//     "marital": false,
//     "address": "patient5",
//     "city": "patient5",
//     "state": "patient5",
//     "country": "patient5",
//     "languagePatient": "English",
//     "home": "patient5",
//     "work": "patient5",
//     "mobile": "0987654321",
//     "emergencyContact": [{
//         "emergencyContactName": "bameanhchiem",
//         "home": "N_A",
//         "work": "N_A",
//         "mobile": "0123456789",
//     }],
//     "provider": "N_A",
//     "insuranceNumber": "N_A"
// };
// addPatientInfoAsset(data,"PATIENT5");
//okay
async function addPatientInfoAsset(data, personID) {
    log(chalk.bgRed("Start creating a new asset patient info"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        const definition = await businessNetworkConnection.connect('admin@ehr');
        let assetRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.PatientInformation');
        let factory = definition.getFactory();

        // //define information of a user
        let asset = factory.newResource('org.uit.ehr', "PatientInformation", personID);
        asset.marriageStatus = data.marriageStatus;
        asset.nationality = data.nationality;

        var patientDemographic = factory.newConcept("org.uit.ehr.PatientDemographic", "Demographic");

        var patientName = factory.newConcept("org.uit.ehr.PatientDemographic", "Name");
        patientName.firstName = data.firstName;
        patientName.lastName = data.lastName;
        patientDemographic.patientName = patientName;

        patientDemographic.dateOfBirth = data.day + "/" + data.month + "/" + data.year;
        patientDemographic.gender = data.gender;
        patientDemographic.ethnicity = data.ethnicity;
        // patientDemographic.marital = data.marital;

        var contact = factory.newConcept("org.uit.ehr.PatientDemographic", "Contact");
        var address = factory.newConcept("org.uit.ehr.PatientDemographic", "Address");
        address.address = data.address;
        address.city = data.city;
        address.state = data.state;
        address.country = data.country;
        contact.address = address;

        var phoneNumber = factory.newConcept("org.uit.ehr.PatientDemographic", "PhoneNumber");
        phoneNumber.home = data.home;
        phoneNumber.work = data.work;
        phoneNumber.mobile = data.mobile;
        contact.patientPhoneNumber = phoneNumber;

        // var emergencyContact = factory.newConcept("org.uit.ehr.PatientDemographic", "EmergencyContact");
        // count = data.emergencyContact.length;
        // phoneNumber = null;
        // contact.emergencyContact = [];
        // for (var i = 0; i < count; i++) {
        //     emergencyContact.emergencyContactName = data.emergencyContact[i].emergencyContactName;
        //     phoneNumber = factory.newConcept("org.uit.ehr.PatientDemographic", "PhoneNumber");
        //     phoneNumber.home = data.emergencyContact[i].home;
        //     phoneNumber.work = data.emergencyContact[i].work;
        //     phoneNumber.mobile = data.emergencyContact[i].mobile;
        //     emergencyContact.emergencyContactPhone = phoneNumber;
        //     contact.emergencyContact.push(emergencyContact);
        //     phoneNumber = null;
        //     emergencyContact = null;
        //     emergencyContact = factory.newConcept("org.uit.ehr.PatientDemographic", "EmergencyContact");

        // }
        var emergencyContact = factory.newConcept("org.uit.ehr.PatientDemographic", "EmergencyContact");
        emergencyContact.emergencyContactName = data.emergencyContactName;
        emergencyContact.emergencyContactPhone = data.emergencyContactPhone;
        contact.emergencyContact = emergencyContact;
        patientDemographic.contact = contact;

        patientDemographic.language = data.languagePatient;

        var healthInsurance = factory.newConcept("org.uit.ehr.PatientDemographic", "HealthInsurance");
        healthInsurance.provider = data.provider;
        healthInsurance.insuranceNumber = data.insuranceNumber;
        patientDemographic.healthInsurance = healthInsurance;
        asset.patientDemographic = patientDemographic;


        asset.authorizedDoctors = [];
        var owner = factory.newRelationship("org.uit.ehr", "Patient", personID);
        asset.owner = owner;

        //add a new participant to business network
        await assetRegistry.add(asset);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Add a new patient info asset successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
    }
}

// getPatientInfoAsset("DOCTOR2@ehr");
//okay
async function getPatientInfoAsset(cardName) {
    log(chalk.bgRed("Start getting a patient info asset"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect(cardName);
        let doctorInfoRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.PatientInformation');
        var result = await doctorInfoRegistry.getAll();
        // log(result[0]);
        //disconect admin card
        await businessNetworkConnection.disconnect();
        var info = null;
        var arr = [];
        for (var i in result) {
            info = {
                "patientInfoID": result[i].patientInfoID,
                "marriageStatus": result[i].marriageStatus,
                "nationality": result[i].nationality,
                "patientDemographic": {
                    "patientName": {
                        "firstName": result[i].patientDemographic.patientName.firstName,
                        "lastName": result[i].patientDemographic.patientName.lastName,
                    },
                    "dateOfBirth": result[i].patientDemographic.dateOfBirth,
                    "gender": result[i].patientDemographic.gender,
                    "ethnicity": result[i].patientDemographic.ethnicity,
                    "contact": {
                        "address": {
                            "address": result[i].patientDemographic.contact.address.address,
                            "city": result[i].patientDemographic.contact.address.city,
                            "state": result[i].patientDemographic.contact.address.state,
                            "country": result[i].patientDemographic.contact.address.country,
                        },
                        "patientPhoneNumber": {
                            "home": result[i].patientDemographic.contact.patientPhoneNumber.home,
                            "work": result[i].patientDemographic.contact.patientPhoneNumber.work,
                            "mobile": result[i].patientDemographic.contact.patientPhoneNumber.mobile,
                        },
                        "emergencyContact": {
                            "emergencyContactName": result[i].patientDemographic.contact.emergencyContact.emergencyContactName,
                            "emergencyContactPhone": result[i].patientDemographic.contact.emergencyContact.emergencyContactPhone,
                        }
                    },
                    "language": result[i].patientDemographic.language,

                    "healthInsurance": {
                        "provider": result[i].patientDemographic.healthInsurance.provider,
                        "insuranceNumber": result[i].patientDemographic.healthInsurance.insuranceNumber
                    },
                },
            };

            // var emerContact = null;
            // for (var j in result[i].patientDemographic.contact.emergencyContact) {
            //     // console.log(result[i].patientDemographic.contact.emergencyContact[j]);
            //     emerContact = {
            // "emergencyContactName": result[i].patientDemographic.contact.emergencyContact[j].emergencyContactName,
            // "emergencyContactPhone": result[i].patientDemographic.contact.emergencyContact[j].emergencyContactPhone,
            //     }
            //     info.patientDemographic.contact.emergencyContact.push(emerContact);
            //     emerContact = null;
            // }

            arr.push(info);
        }
        // log(JSON.stringify(arr));
        log(chalk.green("getted a patient info asset successfully"));
        return arr;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return null;
    }
}

// getPatientInfoAssetById("DOCTOR2@ehr", "PATIENT3")
//okay
async function getPatientInfoAssetById(cardName, infoId) {
    log(chalk.bgRed("Start getting a patient info asset"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect(cardName);
        let doctorInfoRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.PatientInformation');
        var result = await doctorInfoRegistry.get(infoId);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        var info = null;
        info = {
            "patientInfoID": result.patientInfoID,
            "marriageStatus": result.marriageStatus,
            "nationality": result.nationality,
            "patientDemographic": {
                "patientName": {
                    "firstName": result.patientDemographic.patientName.firstName,
                    "lastName": result.patientDemographic.patientName.lastName,
                },
                "dateOfBirth": result.patientDemographic.dateOfBirth,
                "gender": result.patientDemographic.gender,
                "ethnicity": result.patientDemographic.ethnicity,
                "contact": {
                    "address": {
                        "address": result.patientDemographic.contact.address.address,
                        "city": result.patientDemographic.contact.address.city,
                        "state": result.patientDemographic.contact.address.state,
                        "country": result.patientDemographic.contact.address.country,
                    },
                    "patientPhoneNumber": {
                        "home": result.patientDemographic.contact.patientPhoneNumber.home,
                        "work": result.patientDemographic.contact.patientPhoneNumber.work,
                        "mobile": result.patientDemographic.contact.patientPhoneNumber.mobile,
                    },
                    "emergencyContact": []
                },
                "language": result.patientDemographic.language,
                "healthInsurance": {
                    "provider": result.patientDemographic.healthInsurance.provider,
                    "insuranceNumber": result.patientDemographic.healthInsurance.insuranceNumber
                },
            },
        };

        var emerContact = null;
        for (var j in result.patientDemographic.contact.emergencyContact) {
            // console.log(result.patientDemographic.contact.emergencyContact[j]);
            emerContact = {
                "emergencyContactName": result.patientDemographic.contact.emergencyContact[j].emergencyContactName,
                "emergencyContactPhone": {
                    "home": result.patientDemographic.contact.emergencyContact[j].emergencyContactPhone.home,
                    "work": result.patientDemographic.contact.emergencyContact[j].emergencyContactPhone.work,
                    "mobile": result.patientDemographic.contact.emergencyContact[j].emergencyContactPhone.mobile,
                }
            }
            info.patientDemographic.contact.emergencyContact.push(emerContact);
            emerContact = null;
        }
        // log(info);
        log(chalk.green("getted a patient info asset successfully"));
        return info;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return null;
    }
}