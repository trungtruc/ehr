const chalk = require('chalk');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const log = console.log;
module.exports = { createHealthRecord, getAllHealthRecord, getHealthRecordById, createHealthRecordFromCRH };

// createHealthRecord(data, cardName, "HEALTHRECORD123", "20/8/2019");
//xong
async function createHealthRecord(data, cardName, healthRecordId, createdAt) {
    log(chalk.bgRed("Start creating a new health record by doctor: " + cardName));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        const definition = await businessNetworkConnection.connect(cardName);
        let assetRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.HealthRecord');
        let factory = definition.getFactory();

        let asset = factory.newResource('org.uit.ehr', "HealthRecord", healthRecordId);
        asset.doctorId = cardName.split("@")[0];
        asset.createdAt = createdAt;

        //NursingAssessment
        var nursingAssessment = factory.newConcept("org.uit.ehr.NursingAssessment", "NursingAssessment");
        var allergiesAndReactions = factory.newConcept("org.uit.ehr.NursingAssessment", "AllergiesAndReactions");
        count = 0;
        count = data.drugs.length;
        allergiesAndReactions.drugs = [];
        for (var i = 0; i < count; i++) {
            allergiesAndReactions.drugs.push(data.drugs[i]);
        }
        count = data.foods.length;
        allergiesAndReactions.foods = [];
        for (var i = 0; i < count; i++) {
            allergiesAndReactions.foods.push(data.foods[i]);
        }
        count = data.other.length;
        allergiesAndReactions.other = [];
        for (var i = 0; i < count; i++) {
            allergiesAndReactions.other.push(data.other[i]);
        }
        nursingAssessment.allergiesAndReactions = allergiesAndReactions;

        var communication = factory.newConcept("org.uit.ehr.NursingAssessment", "Communication");
        communication.language = data.languages;//hen xui
        if (data.hearingDifficult === "no") {
            communication.hearingDifficult = false;
        } else {
            communication.hearingDifficult = true;
        }
        // communication.hearingDifficult = data.hearingDifficult;
        communication.informationObtainedFrom = data.informationObtainedFrom;
        communication.comment = data.comment;
        nursingAssessment.communication = communication;

        var vitalSigns = factory.newConcept("org.uit.ehr.NursingAssessment", "VitalSigns");
        vitalSigns.height = parseInt(data.height);
        vitalSigns.weight = parseInt(data.weight);
        vitalSigns.bodyTemperature = parseInt(data.bodyTemperature);
        vitalSigns.pulse = parseInt(data.pulse);
        vitalSigns.breathing = parseInt(data.breath);
        // var bloodPressure = factory.newConcept("org.uit.ehr.NursingAssessment", "BloodPressure");
        // bloodPressure.systolicPressure = data.systolicPressure;
        // bloodPressure.diastolicPressure = data.diastolicPressure;
        vitalSigns.bloodPressure = parseInt(data.bloodPressure);
        nursingAssessment.vitalSigns = vitalSigns;

        nursingAssessment.skin = data.skin; //hen xui

        var cognitiveFunction = factory.newConcept("org.uit.ehr.NursingAssessment", "CognitiveFunction");
        cognitiveFunction.behaviour = data.behaviour;
        cognitiveFunction.affect = data.affect;
        nursingAssessment.cognitiveFunction = cognitiveFunction;

        var respiratoryAssessment = factory.newConcept("org.uit.ehr.NursingAssessment", "RespiratoryAssessment");
        var shortnessOfBreath = null;
        if (data.shortnessOfBreath === "False") {
            shortnessOfBreath = false;
        } else if (data.shortnessOfBreath === "True") {
            shortnessOfBreath = true;
        }
        respiratoryAssessment.shortnessOfBreath = shortnessOfBreath;
        var cough = null;
        if (data.cough === "False") {
            cough = false;
        } else if (data.cough === "True") {
            cough = true;
        }
        nursingAssessment.neurologicalAssessment = [];
        respiratoryAssessment.cough = cough;
        if (Array.isArray(data.neurologicalAssessment) === true) {
            count = data.neurologicalAssessment.length;
            nursingAssessment.neurologicalAssessment = [];
            for (var i = 0; i < count; i++) {
                nursingAssessment.neurologicalAssessment.push(data.neurologicalAssessment[i]);
            }
        } else {
            nursingAssessment.neurologicalAssessment[0] = data.neurologicalAssessment;
        }

        nursingAssessment.respiratoryAssessment = respiratoryAssessment;
        asset.nursingAssessment = nursingAssessment;




        //DischangeSummary
        var dischangesummary = factory.newConcept("org.uit.ehr.DischangeSummary", "DisSum");

        var admissionDetail = factory.newConcept("org.uit.ehr.DischangeSummary", "AdmissionDetail");
        admissionDetail.dateOfAdmission = data.dateOfAdmission;
        admissionDetail.sourceOfReferral = data.sourceOfReferral;
        admissionDetail.admissionMethod = data.admissionMethod;
        dischangesummary.admissionDetail = admissionDetail;

        var dischargeDetail = factory.newConcept("org.uit.ehr.DischangeSummary", "DischargeDetail");
        dischargeDetail.dateOfDischarge = data.dateOfDischarge;
        dischargeDetail.dischargeMethod = data.dischargeMethod;
        dischargeDetail.patientStatus = data.patientStatus;
        var patientDied = null;
        if (data.patientDied)
            patientDied = true;
        else patientDied = false;
        dischargeDetail.patientDied = patientDied;
        dischargeDetail.dateOfDead = data.dateOfDead;
        dischargeDetail.causeOfDead = data.causeOfDead;
        dischangesummary.dischargeDetail = dischargeDetail;

        var clinicalNarrative = factory.newConcept("org.uit.ehr.DischangeSummary", "ClinicalNarrative");
        clinicalNarrative.diagnoses = data.diagnoses;
        clinicalNarrative.operationsAndProcedures = data.operationsAndProcedures;
        clinicalNarrative.clinicalAlerts = data.clinicalAlerts;
        clinicalNarrative.allergies = data.allergies;
        clinicalNarrative.adverseEvents = data.adverseEvents;
        clinicalNarrative.hospitalCourse = data.hospitalCourse;
        clinicalNarrative.investigationsAndResult = data.investigationsAndResult;
        clinicalNarrative.treatments = data.treatments;
        clinicalNarrative.diet = data.diet;
        clinicalNarrative.functionalState = data.functionalState;
        clinicalNarrative.immunisations = data.immunisations;
        clinicalNarrative.infectionControlStatus = data.infectionControlStatus;

        dischangesummary.clinicalNarrative = clinicalNarrative;

        var medicationDetail = factory.newConcept("org.uit.ehr.DischangeSummary", "MedicationDetail");
        var medication = factory.newConcept("org.uit.ehr.DischangeSummary", "Medication");
        medicationDetail.medicationOnDischarge = [];

        var count = data.medicationName.length;
        for (var i = 0; i < count; i++) {
            medication.medicationName = data.medicationName[i];
            medication.takenFor = data.takenFor[i];
            medication.direction = data.direction[i];
            medicationDetail.medicationOnDischarge[i] = medication;
            medication = null;
            medication = factory.newConcept("org.uit.ehr.DischangeSummary", "Medication");

        };

        // medicationDetail.medicationStopped = [];
        // count = data.medicationDetail.medicationStopped.length;
        // for (var i = 0; i < count; i++) {
        //     medication.medicationName = data.medicationDetail.medicationStopped[i].medicationName;
        //     medication.takenFor = data.medicationDetail.medicationStopped[i].takenFor;
        //     medication.direction = data.medicationDetail.medicationStopped[i].direction;

        //     medicationDetail.medicationStopped.push(medication);
        //     medication = null;
        //     medication = factory.newConcept("org.uit.ehr.DischangeSummary", "Medication");

        // };
        dischangesummary.medicationDetail = medicationDetail;
        asset.dischangeSummary = dischangesummary;



        //RadiologicReport
        var radiologicReport = factory.newConcept("org.uit.ehr.RadiologicReport", "RadiologicReport");
        radiologicReport.radiologicImageId = data.radiologicImageId;

        var exam = factory.newConcept("org.uit.ehr.RadiologicReport", "Exam");
        exam.examType = data.examType;
        exam.dateOfExam = data.dateOfExam;
        radiologicReport.exam = exam;

        radiologicReport.clinicalHistory = data.clinicalHistory;

        // var comparison = factory.newConcept("org.uit.ehr.RadiologicReport", "Comparison");
        // comparison.examType = data.examTypeComparison;
        // comparison.date = data.date;
        // radiologicReport.comparison = comparison;

        radiologicReport.technique = data.technique;
        radiologicReport.findings = data.findings;
        radiologicReport.impression = data.impression;
        asset.radiologicReport = radiologicReport;

        //Patient's Demographic
        // var patientDemographic = factory.newConcept("org.uit.ehr.PatientDemographic", "Demographic");

        // var patientName = factory.newConcept("org.uit.ehr.PatientDemographic", "Name");
        // patientName.firstName = data.firstName;
        // patientName.lastName = data.lastName;
        // patientDemographic.patientName = patientName;

        // patientDemographic.dateOfBirth = data.dateOfBirth;
        // patientDemographic.gender = data.gender;
        // patientDemographic.ethnicity = data.ethnicity;
        // patientDemographic.marital = data.marital;

        // var contact = factory.newConcept("org.uit.ehr.PatientDemographic", "Contact");
        // var address = factory.newConcept("org.uit.ehr.PatientDemographic", "Address");
        // address.address = data.address;
        // address.city = data.city;
        // address.state = data.state;
        // address.country = data.country;
        // contact.address = address;

        // var phoneNumber = factory.newConcept("org.uit.ehr.PatientDemographic", "PhoneNumber");
        // phoneNumber.home = data.home;
        // phoneNumber.work = data.work;
        // phoneNumber.mobile = data.mobile;
        // contact.patientPhoneNumber = phoneNumber;

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
        // patientDemographic.contact = contact;

        // patientDemographic.language = data.languagePatient;

        // var healthInsurance = factory.newConcept("org.uit.ehr.PatientDemographic", "HealthInsurance");
        // healthInsurance.provider = data.provider;
        // healthInsurance.insuranceNumber = data.insuranceNumber;
        // patientDemographic.healthInsurance = healthInsurance;
        // asset.patientDemographic = patientDemographic;

        asset.authorizedDoctors = [];
        var owner = factory.newRelationship("org.uit.ehr", "Patient", data.patientId);
        asset.owner = owner;

        // // //add a new participant to business network
        await assetRegistry.add(asset);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Add a new health record successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
    }
}

// getAllHealthRecord("PATIENT7@ehr");
//okay
async function getAllHealthRecord(cardName) {
    log(chalk.bgRed("Start getting all health record"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect(cardName);
        let healthRecordRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.HealthRecord');
        var result = await healthRecordRegistry.getAll();
        var allHealthRecords = [];
        var healthRecord = null;
        for (var i in result) {
            healthRecord = await convertdata(result[i]);
            allHealthRecords.push(healthRecord);
            healthRecord = null;
        };
        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("getted all health record successfully"));
        return allHealthRecords;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return null;
        // return 0;
    }
}

// getHealthRecordById("PATIENT2@ehr", "HEALTHRECORD1");
async function getHealthRecordById(cardName, healthRecordId) {
    log(chalk.bgRed("Start getting health record with id: ", healthRecordId));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect(cardName);
        let healthRecordRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.HealthRecord');
        var result = await healthRecordRegistry.get(healthRecordId);
        var healthRecord = await convertdata(result);
        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("getted all health record successfully"));
        return healthRecord;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return null;
    }
}

//okay 
async function convertdata(data) {
    var medicationOnDischarge = [];
    var obj = null;
    for (var i in data.dischangeSummary.medicationDetail.medicationOnDischarge) {
        obj = {
            "medicationName": data.dischangeSummary.medicationDetail.medicationOnDischarge[i].medicationName,
            "takenFor": data.dischangeSummary.medicationDetail.medicationOnDischarge[i].takenFor,
            "direction": data.dischangeSummary.medicationDetail.medicationOnDischarge[i].direction
        };
        medicationOnDischarge.push(obj);
    };

    var owner = data.owner.getIdentifier();
    var result = {
        "healthRecordId": data.healthRecordId,
        "doctorId": data.doctorId,
        "createdAt": data.createdAt,
        "dischangeSummary": {
            "admissionDetail": {
                "dateOfAdmission": data.dischangeSummary.admissionDetail.dateOfAdmission,//string
                "sourceOfReferral": data.dischangeSummary.admissionDetail.sourceOfReferral,//string
                "admissionMethod": data.dischangeSummary.admissionDetail.admissionMethod,//string
            },
            "dischargeDetail": {
                "dateOfDischarge": data.dischangeSummary.dischargeDetail.dateOfDischarge,
                "dischargeMethod": data.dischangeSummary.dischargeDetail.dischargeMethod,
                "patientStatus": data.dischangeSummary.dischargeDetail.patientStatus,
                "patientDied": data.dischangeSummary.dischargeDetail.patientDied,//boolean
                "dateOfDead": data.dischangeSummary.dischargeDetail.dateOfDead,
                "causeOfDead": data.dischangeSummary.dischargeDetail.causeOfDead,
            },
            "clinicalNarrative": {
                "diagnoses": data.dischangeSummary.clinicalNarrative.diagnoses,
                "operationsAndProcedures": data.dischangeSummary.clinicalNarrative.operationsAndProcedures,
                "clinicalAlerts": data.dischangeSummary.clinicalNarrative.clinicalAlerts,
                "allergies": data.dischangeSummary.clinicalNarrative.allergies,
                "adverseEvents": data.dischangeSummary.clinicalNarrative.adverseEvents,
                "hospitalCourse": data.dischangeSummary.clinicalNarrative.hospitalCourse,
                "investigationsAndResult": data.dischangeSummary.clinicalNarrative.investigationsAndResult,
                "treatments": data.dischangeSummary.clinicalNarrative.treatments,
                "diet": data.dischangeSummary.clinicalNarrative.diet,
                "functionalState": data.dischangeSummary.clinicalNarrative.functionalState,
                "immunisations": data.dischangeSummary.clinicalNarrative.immunisations,
                "infectionControlStatus": data.dischangeSummary.clinicalNarrative.infectionControlStatus,
            },
            "medicationDetail": {
                "medicationOnDischarge": medicationOnDischarge,//mang linh dong so phan tu
            },
        },
        "nursingAssessment": {
            "allergiesAndReactions": {
                "drugs": data.nursingAssessment.allergiesAndReactions.drugs,//mang linh dong so phan tu
                "foods": data.nursingAssessment.allergiesAndReactions.foods,//mang linh dong so phan tu
                "other": data.nursingAssessment.allergiesAndReactions.other,//mang linh dong so phan tu
            },
            "communication": {
                "language": data.nursingAssessment.communication.language,//mang linh dong so phan tu
                "hearingDifficult": data.nursingAssessment.communication.hearingDifficult, //boolean
                "informationObtainedFrom": data.nursingAssessment.communication.informationObtainedFrom,
                "comment": data.nursingAssessment.communication.comment,
            },
            "vitalSigns": {
                "height": data.nursingAssessment.vitalSigns.height,
                "weight": data.nursingAssessment.vitalSigns.weight,
                "bodyTemperature": data.nursingAssessment.vitalSigns.bodyTemperature,
                "pulse": data.nursingAssessment.vitalSigns.pulse,
                "breathing": data.nursingAssessment.vitalSigns.breathing,
                "bloodPressure": data.nursingAssessment.vitalSigns.bloodPressure,
            },
            "neurologicalAssessment": data.nursingAssessment.neurologicalAssessment,
            "skin": data.nursingAssessment.skin,
            "cognitiveFunction": {
                "behaviour": data.nursingAssessment.cognitiveFunction.behaviour,
                "affect": data.nursingAssessment.cognitiveFunction.affect,
            },
            "respiratoryAssessment": {
                "shortnessOfBreath": data.nursingAssessment.respiratoryAssessment.shortnessOfBreath,
                "cough": data.nursingAssessment.respiratoryAssessment.cough,
            }
        },
        "radiologicReport": {
            "radiologicImageId": data.radiologicReport.radiologicImageId,
            "exam": {
                "examType": data.radiologicReport.exam.examType,
                "dateOfExam": data.radiologicReport.exam.dateOfExam,
            },
            "clinicalHistory": data.radiologicReport.clinicalHistory,
            "technique": data.radiologicReport.technique,
            "findings": data.radiologicReport.findings,
            "impression": data.radiologicReport.impression,
        },
        "authorizedDoctors": data.authorizedDoctors,
        "owner": owner
    };
    return result;
}

async function createHealthRecordFromCRH(data, cardName, healthRecordId, createdAt) {
    log(chalk.bgRed("Start creating a new health record by Cho Ray Hospital "));
    let businessNetworkConnection = new BusinessNetworkConnection();
    console.log(data)
    try {
        var patientId = cardName.split("@")[0];
        const definition = await businessNetworkConnection.connect("ChoRayHospital@ehr");
        let assetRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.HealthRecord');
        let factory = definition.getFactory();

        let asset = factory.newResource('org.uit.ehr', "HealthRecord", healthRecordId);
        asset.doctorId = "ChoRayHospital";
        asset.createdAt = createdAt;

        //DischangeSummary
        var dischangesummary = factory.newConcept("org.uit.ehr.DischangeSummary", "DisSum");

        var admissionDetail = factory.newConcept("org.uit.ehr.DischangeSummary", "AdmissionDetail");
        admissionDetail.dateOfAdmission = data.dischangeSummary.admissionDetail.dateOfAdmission;
        admissionDetail.sourceOfReferral = data.dischangeSummary.admissionDetail.sourceOfReferral;
        admissionDetail.admissionMethod = data.dischangeSummary.admissionDetail.admissionMethod;
        dischangesummary.admissionDetail = admissionDetail;

        var dischargeDetail = factory.newConcept("org.uit.ehr.DischangeSummary", "DischargeDetail");
        dischargeDetail.dateOfDischarge = data.dischangeSummary.dischargeDetail.dateOfDischarge;
        dischargeDetail.dischargeMethod = data.dischangeSummary.dischargeDetail.dischargeMethod;
        dischargeDetail.patientStatus = data.dischangeSummary.dischargeDetail.patientStatus;
        dischargeDetail.patientDied = data.dischangeSummary.dischargeDetail.patientDied;
        dischargeDetail.dateOfDead = data.dischangeSummary.dischargeDetail.dateOfDead;
        dischargeDetail.causeOfDead = data.dischangeSummary.dischargeDetail.causeOfDead;
        dischangesummary.dischargeDetail = dischargeDetail;

        var clinicalNarrative = factory.newConcept("org.uit.ehr.DischangeSummary", "ClinicalNarrative");
        clinicalNarrative.diagnoses = data.dischangeSummary.clinicalNarrative.diagnoses;
        clinicalNarrative.operationsAndProcedures = data.dischangeSummary.clinicalNarrative.operationsAndProcedures;
        clinicalNarrative.clinicalAlerts = data.dischangeSummary.clinicalNarrative.clinicalAlerts;
        clinicalNarrative.allergies = data.dischangeSummary.clinicalNarrative.allergies;
        clinicalNarrative.adverseEvents = data.dischangeSummary.clinicalNarrative.adverseEvents;
        clinicalNarrative.hospitalCourse = data.dischangeSummary.clinicalNarrative.hospitalCourse;
        clinicalNarrative.investigationsAndResult = data.dischangeSummary.clinicalNarrative.investigationsAndResult;
        clinicalNarrative.treatments = data.dischangeSummary.clinicalNarrative.treatments;
        clinicalNarrative.diet = data.dischangeSummary.clinicalNarrative.diet;
        clinicalNarrative.functionalState = data.dischangeSummary.clinicalNarrative.functionalState;
        clinicalNarrative.immunisations = data.dischangeSummary.clinicalNarrative.immunisations;
        clinicalNarrative.infectionControlStatus = data.dischangeSummary.clinicalNarrative.infectionControlStatus;
        dischangesummary.clinicalNarrative = clinicalNarrative;

        var medicationDetail = factory.newConcept("org.uit.ehr.DischangeSummary", "MedicationDetail");
        var medication = factory.newConcept("org.uit.ehr.DischangeSummary", "Medication");
        medicationDetail.medicationOnDischarge = [];

        var count = data.dischangeSummary.medicationDetail.medicationOnDischarge.length;
        for (var i = 0; i < count; i++) {
            medication.medicationName = data.dischangeSummary.medicationDetail.medicationOnDischarge[i].medicationName;
            medication.takenFor = data.dischangeSummary.medicationDetail.medicationOnDischarge[i].takenFor;
            medication.direction = data.dischangeSummary.medicationDetail.medicationOnDischarge[i].direction;
            medicationDetail.medicationOnDischarge[i] = medication;
            medication = null;
            medication = factory.newConcept("org.uit.ehr.DischangeSummary", "Medication");

        };

        dischangesummary.medicationDetail = medicationDetail;
        asset.dischangeSummary = dischangesummary;

        //NursingAssessment
        var nursingAssessment = factory.newConcept("org.uit.ehr.NursingAssessment", "NursingAssessment");
        var allergiesAndReactions = factory.newConcept("org.uit.ehr.NursingAssessment", "AllergiesAndReactions");
        count = 0;
        count = data.nursingAssessment.allergiesAndReactions.drugs.length;
        allergiesAndReactions.drugs = [];
        for (var i = 0; i < count; i++) {
            allergiesAndReactions.drugs.push(data.nursingAssessment.allergiesAndReactions.drugs[i]);
        }
        count = data.nursingAssessment.allergiesAndReactions.foods.length;
        allergiesAndReactions.foods = [];
        for (var i = 0; i < count; i++) {
            allergiesAndReactions.foods.push(data.nursingAssessment.allergiesAndReactions.foods[i]);
        }
        count = data.nursingAssessment.allergiesAndReactions.other.length;
        allergiesAndReactions.other = [];
        for (var i = 0; i < count; i++) {
            allergiesAndReactions.other.push(data.nursingAssessment.allergiesAndReactions.other[i]);
        }
        nursingAssessment.allergiesAndReactions = allergiesAndReactions;

        var communication = factory.newConcept("org.uit.ehr.NursingAssessment", "Communication");
        count = data.nursingAssessment.communication.language.length;
        communication.language = [];
        for (vari = 0; i < count; i++) {
            communication.language.push(data.nursingAssessment.communication.language[i]);
        }

        communication.hearingDifficult = data.nursingAssessment.communication.hearingDifficult;
        communication.informationObtainedFrom = data.nursingAssessment.communication.informationObtainedFrom;
        communication.comment = data.nursingAssessment.communication.comment;
        nursingAssessment.communication = communication;

        var vitalSigns = factory.newConcept("org.uit.ehr.NursingAssessment", "VitalSigns");
        vitalSigns.height = data.nursingAssessment.vitalSigns.height;
        vitalSigns.weight = data.nursingAssessment.vitalSigns.weight;
        vitalSigns.bodyTemperature = data.nursingAssessment.vitalSigns.bodyTemperature;
        vitalSigns.pulse = data.nursingAssessment.vitalSigns.pulse;
        vitalSigns.breathing = data.nursingAssessment.vitalSigns.breathing;
        vitalSigns.bloodPressure = parseInt(data.nursingAssessment.vitalSigns.bloodPressure);
        nursingAssessment.vitalSigns = vitalSigns;

        count = data.nursingAssessment.neurologicalAssessment.length;
        nursingAssessment.neurologicalAssessment = [];
        for (var i = 0; i < count; i++) {
            nursingAssessment.neurologicalAssessment.push(data.nursingAssessment.neurologicalAssessment[i]);
        }
        nursingAssessment.skin = data.nursingAssessment.skin;

        var cognitiveFunction = factory.newConcept("org.uit.ehr.NursingAssessment", "CognitiveFunction");
        cognitiveFunction.behaviour = data.nursingAssessment.cognitiveFunction.behaviour;
        cognitiveFunction.affect = data.nursingAssessment.cognitiveFunction.affect;
        nursingAssessment.cognitiveFunction = cognitiveFunction;

        var respiratoryAssessment = factory.newConcept("org.uit.ehr.NursingAssessment", "RespiratoryAssessment");
        respiratoryAssessment.shortnessOfBreath = data.nursingAssessment.respiratoryAssessment.shortnessOfBreath;
        respiratoryAssessment.cough = data.nursingAssessment.respiratoryAssessment.cough;

        nursingAssessment.respiratoryAssessment = respiratoryAssessment;
        asset.nursingAssessment = nursingAssessment;

        //RadiologicReport
        var radiologicReport = factory.newConcept("org.uit.ehr.RadiologicReport", "RadiologicReport");
        radiologicReport.radiologicImageId = data.radiologicReport.radiologicImageId;

        var exam = factory.newConcept("org.uit.ehr.RadiologicReport", "Exam");
        exam.examType = data.radiologicReport.exam.examType;
        exam.dateOfExam = data.radiologicReport.exam.dateOfExam;
        radiologicReport.exam = exam;

        radiologicReport.clinicalHistory = data.radiologicReport.clinicalHistory;

        // var comparison = factory.newConcept("org.uit.ehr.RadiologicReport", "Comparison");
        // comparison.examType = data.radiologicReport.comparison.examType;
        // comparison.date = data.radiologicReport.comparison.date;
        // radiologicReport.comparison = comparison;

        radiologicReport.technique = data.radiologicReport.technique;
        radiologicReport.findings = data.radiologicReport.findings;
        radiologicReport.impression = data.radiologicReport.impression;
        asset.radiologicReport = radiologicReport;

        asset.authorizedDoctors = [];
        var owner = factory.newRelationship("org.uit.ehr", "Patient", patientId);
        asset.owner = owner;

        // // //add a new participant to business network
        await assetRegistry.add(asset);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Add a new health record successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
    }
}

/**
 * data from cho ray hospital
 * {
    "success": true,
    "data": [
        {
            "dischangeSummary": {
                "admissionDetail": {
                    "dateOfAdmission": "HealthRecord2a",
                    "sourceOfReferral": "HealthRecord2a",
                    "admissionMethod": "HealthRecord2a"
                },
                "dischargeDetail": {
                    "dateOfDischarge": "HealthRecord2a",
                    "dischargeMethod": "HealthRecord2a",
                    "patientStatus": "HealthRecord2a",
                    "patientDied": false,
                    "dateOfDead ": "HealthRecord2a",
                    "causeOfDead": "HealthRecord2a"
                },
                "clinicalNarrative": {
                    "diagnoses": "HealthRecord2a",
                    "operationsAndProcedures": "HealthRecord2a",
                    "clinicalAlerts": "HealthRecord2a",
                    "allergies": "HealthRecord2a",
                    "adverseEvents": "HealthRecord2a",
                    "hospitalCourse": "HealthRecord2a",
                    "investigationsAndResult": "HealthRecord2a",
                    "treatments": "HealthRecord2a",
                    "diet": "HealthRecord2a",
                    "functionalState": "HealthRecord2a",
                    "immunisations": "HealthRecord2a",
                    "infectionControlStatus": "HealthRecord2a"
                },
                "medicationDetail": {
                    "medicationOnDischarge": [
                        {
                            "medicationName": "HealthRecord2a",
                            "takenFor": "HealthRecord2a",
                            "direction": "HealthRecord2a"
                        },
                        {
                            "medicationName": "HealthRecord2a",
                            "takenFor": "HealthRecord2a",
                            "direction": "HealthRecord2a"
                        }
                    ]
                }
            },
            "nursingAssessment": {
                "allergiesAndReactions": {
                    "drugs": [
                        "HealthRecord2a",
                        "HealthRecord2a"
                    ],
                    "foods": [
                        "HealthRecord2a",
                        "HealthRecord2a"
                    ],
                    "other": [
                        "HealthRecord2a"
                    ]
                },
                "communication": {
                    "language": [
                        "HealthRecord2a"
                    ],
                    "hearingDifficult": false,
                    "informationObtainedFrom": "HealthRecord2a",
                    "comment": "HealthRecord2a"
                },
                "vitalSigns": {
                    "height": 0,
                    "weight": 0,
                    "bodyTemperature": 0,
                    "pulse": 0,
                    "breathing": 0,
                    "bloodPressure": 130
                },
                "neurologicalAssessment": [
                    "HealthRecord2a"
                ],
                "skin": "HealthRecord2a",
                "cognitiveFunction": {
                    "behaviour": "HealthRecord2a",
                    "affect": "HealthRecord2a"
                },
                "respiratoryAssessment": {
                    "shortnessOfBreath": false,
                    "cough": false
                }
            },
            "radiologicReport": {
                "radiologicImageId": "HealthRecord2a",
                "exam": {
                    "examType": "HealthRecord2a",
                    "dateOfExam": "HealthRecord2a"
                },
                "clinicalHistory": "HealthRecord2a",
                "comparison": {
                    "examType": "HealthRecord2a",
                    "date": "HealthRecord2a"
                },
                "technique": "HealthRecord2a",
                "findings": "HealthRecord2a",
                "impression": "HealthRecord2a"
            },
        }
    ]
}
 */