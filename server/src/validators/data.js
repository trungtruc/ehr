var data = {
    "healthRecordId": "HEALTHRECORD1",
    "patientId": "PATIENT2",
    "createdAt": "22/08/2019", //can xem lai va goi ham ngay thang
    // //DischangeSummary
    "dateOfAdmission": "22/08/2019",
    "sourceOfReferral": "OtherHospital",
    "admissionMethod": "Transfer",
    "dateOfDischarge": "N_A",
    "dischargeMethod": "N_A",
    "patientStatus": "N_A",
    "patientDied": true,
    "dateOfDead": "10/1/2019",
    "causeOfDead": "kk kkk kk",
    "diagnoses": "nothing in here",
    "operationsAndProcedures": "ss  ss",
    "clinicalAlerts": "s s ",
    "allergies": "N_A",
    "adverseEvents": "N_A",
    "hospitalCourse": "N_A",
    "investigationsAndResult": "N_A",
    "treatments": "N_A",
    "diet": "N_A",
    "functionalState": "N_A",
    "immunisations": "N_A",
    "infectionControlStatus": "N_A",
    "medicationDetail": {
        "medicationOnDischarge": [{
            "medicationName": "ab",
            "takenFor": "ab",
            "direction": "ab"
        }, {
            "medicationName": "ac",
            "takenFor": "ac",
            "direction": "ac"
        },
        {
            "medicationName": "ad",
            "takenFor": "ad",
            "direction": "ad"
        }],
        "medicationStopped": [{
            "medicationName": "zx",
            "takenFor": "zx",
            "direction": "zx"
        }, {
            "medicationName": "xc",
            "takenFor": "xc",
            "direction": "xc"
        },
        {
            "medicationName": "cv",
            "takenFor": "cv",
            "direction": "cv"
        }]
    },
    // //NursingAssessment
    "drugs": ["1111", "21111"],
    "foods": ["31111", "411111"],
    "other": ["511111", "611111"],
    "language": ["7111", "811111"],
    "hearingDifficult": false,
    "informationObtainedFrom": "Other",
    "comment": "N_A",
    "height": 162,
    "weight": 62,
    "bodyTemperature": 37,
    "pulse": 20,
    "breathing": 45,
    "systolicPressure": 45,
    "diastolicPressure": 45,
    "neurologicalAssessment": ["Paralysis", "Weekness"],
    "skin": "Dryness ",
    "behaviour": "Agitated",
    "affect": "Sad",
    "shortnessOfBreath": false,
    "cough": false,

    // //RadiologicReport
    "radiologicImageId": "N_A",
    "examType": "MRI",
    "dateOfExam": "1/1/2019",
    "clinicalHistory": "N_A",
    "examTypeComparison": "MRI",//examType
    "date": "20/12/2018",
    "technique": "N_A",
    "findings": "N_A",
    "impression": "N_A",
    // //PatientDemographic
    "firstName": "patient",
    "lastName": "patient",
    "dateOfBirth": "10/10/2019",
    "gender": "Male",
    "ethnicity": "Kinh",
    "marital": false,
    "addressee": "patient",
    "buildingOrDepartment": "patient",
    "lane": "patient",
    "alley": "patient",
    "hamlet": "patient",
    "village": "patient",
    "street": "patient",
    "districtOrTown": "patient",
    "city": "patient",
    "state": "patient",
    "country": "patient",
    "languagePatient": "English",
    "home": "N_A",
    "work": "N_A",
    "mobile": "0987654321",
    "emergencyContact": [{
        "emergencyContactName": "bameanhchiem",
        "home": "N_A",
        "work": "N_A",
        "mobile": "0123456789",
    }],
    "provider": "N_A",
    "insuranceNumber": "N_A"
};
module.exports = data;