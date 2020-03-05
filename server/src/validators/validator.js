
//enum in JOI: https://stackoverflow.com/questions/50156176/how-to-use-enum-values-with-joi-string-validation
const log = console.log;
const Joi = require("joi");

// var data = require("./data");
// log(data);

exports.validator = function (req, res, next) {
    const medication = Joi.object().keys({
        medicationName: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{2,30}$/),
        takenFor: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{2,30}$/),
        direction: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{2,30}$/),
    });//.with('username', 'password');

    const medicationArray = Joi.array().items(medication).min(0).unique();
    var medicationDetail = Joi.object().keys({
        medicationOnDischarge: medicationArray,
        medicationStopped: medicationArray
    });
    var stringArray = Joi.array().items(Joi.string().trim().regex(/^[NA0-9\/\_]{3,10}$/)).min(0).unique();

    var neurologicalAssessment = Joi.array().items(Joi.string().trim().regex(/^[a-zA-Z]{8,9}$/).valid('Paralysis', 'Dizziness', 'Tingling', 'Seizures', 'Numbness', 'Weekness')).min(1).unique();
    var contact = Joi.object().keys({
        emergencyContactName: Joi.string().trim().regex(/^[a-zA-Z0-9\ ]{1,30}$/),
        home: Joi.string().trim().regex(/^[NA0-9\_]{3,10}$/),
        work: Joi.string().trim().regex(/^[NA0-9\_]{3,10}$/),
        mobile: Joi.string().trim().regex(/^[NA0-9\_]{3,10}$/),
    });
    emergencyContact = Joi.array().items(contact).min(0).unique();


    const schema = Joi.object().keys({
        /** HEALTH RECORD 
         * 
        */
        healthRecordId: Joi.string().trim().regex(/^[a-zA-Z0-9]{3,30}$/),
        patientId: Joi.string().trim().regex(/^[a-zA-Z0-9]{3,30}$/),
        createdAt: Joi.string(),
        // //DischargeSummary
        dateOfAdmission: Joi.string().trim().regex(/^[NA0-9\/\_]{3,10}$/),//date
        sourceOfReferral: Joi.string().trim().regex(/^[a-zA-Z0-9]{12,20}$/).valid('SelfReferral', 'AmbulanceService', 'OutOfHoursService', 'OtherHospital'),
        admissionMethod: Joi.string().trim().regex(/^[a-zA-Z0-9]{8,9}$/).valid('Elective', 'Emergency', 'Transfer'),
        dateOfDischarge: Joi.string().trim().regex(/^[NA0-9\/\_]{3,10}$/), //N_A, date
        dischargeMethod: Joi.string().trim().regex(/^[NA0-9\_\ ]{1,30}$/),
        patientStatus: Joi.string().trim().regex(/^[a-zA-Z0-9\_\ ]{3,30}$/),
        patientDied: Joi.boolean(),
        dateOfDead: Joi.string().trim().regex(/^[NA0-9\/\_]{3,10}$/),
        causeOfDead: Joi.string().trim().regex(/^[a-zA-Z0-9\_\ ]{3,30}$/),
        diagnoses: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        operationsAndProcedures: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        clinicalAlerts: Joi.string().trim().regex(/^[/^[a-zA-Z0-9\ \_]{3,30}$/),
        allergies: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        adverseEvents: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        hospitalCourse: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        investigationsAndResult: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        treatments: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        diet: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        functionalState: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        immunisations: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        infectionControlStatus: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        medicationDetail: medicationDetail,
        drugs: stringArray,
        foods: stringArray,
        other: stringArray,
        language: stringArray,
        hearingDifficult: Joi.boolean(),
        informationObtainedFrom: Joi.string().trim().regex(/^[a-zPFO]{4,7}$/).valid('Patient', 'Family', 'Other'),
        comment: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        height: Joi.number().integer().min(1).max(500),
        weight: Joi.number().integer().min(1).max(500),
        bodyTemperature: Joi.number().integer().min(1).max(100),
        pulse: Joi.number().integer().min(1).max(500),
        breathing: Joi.number().integer().min(1).max(500),
        systolicPressure: Joi.number().integer().min(1).max(500),
        diastolicPressure: Joi.number().integer().min(1).max(500),
        neurologicalAssessment: neurologicalAssessment,
        skin: Joi.string().trim().regex(/^[a-zA-Z]{4,11}$/).valid('Rask', 'Redness', 'Bruises', 'Dryness', 'Diaphoresis'),
        behaviour: Joi.string().trim().regex(/^[a-zA-Z]{6,9}$/).valid('Agitated', 'Crying', 'Demanding', 'Restless', 'Shouting', 'Drowsy'),
        affect: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/).valid('Flat', 'Angry', 'Sad', 'Suspicious'),
        shortnessOfBreath: Joi.boolean(),
        cough: Joi.boolean(),
        // //RadiologinReport
        radiologicImageId: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        examType: Joi.string().trim().regex(/^[a-zA-Z]{2,15}$/).valid('MRI', 'CT', 'Ultrasound', 'NuclearMedicine', 'Xray'),
        dateOfExam: Joi.string().trim().regex(/^[NA0-9\/\_]{3,10}$/),//date
        clinicalHistory: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        examTypeComparison: Joi.string().trim().regex(/^[a-zA-Z]{2,15}$/).valid('MRI', 'CT', 'Ultrasound', 'NuclearMedicine', 'Xray'),
        date: Joi.string().trim().regex(/^[NA0-9\/\_]{3,10}$/),//date
        technique: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        findings: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        impression: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        // //PatientDemographic
        firstName: Joi.string().trim().regex(/^[a-zA-Z]{3,30}$/),
        lastName: Joi.string().trim().regex(/^[a-zA-Z]{3,30}$/),
        month: Joi.string().trim().regex(/^[0-9\/]{1,2}$/),//date
        day: Joi.string().trim().regex(/^[0-9\/]{1,2}$/),//date
        year: Joi.string().trim().regex(/^[0-9\/]{4,4}$/),//date
        gender: Joi.string().trim().regex(/^[a-zA-Z]{4,6}$/).valid('Male', 'Female', 'Other'),
        ethnicity: Joi.string().trim().regex(/^[a-zA-Z0-9]{3,15}$/),
        marital: Joi.boolean(),
        address: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        city: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        state: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        country: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        languagePatient: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,12}$/),
        home: Joi.string().trim().regex(/^[NA0-9\_]{0,10}$/),
        work: Joi.string().trim().regex(/^[NA0-9\_]{0,10}$/),
        mobile: Joi.string().trim().regex(/^[NA0-9\_]{0,10}$/),
        emergencyContact: emergencyContact,
        provider: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{1,30}$/),
        insuranceNumber: Joi.string().trim().regex(/^[NA0-9\_]{3,12}$/),
        emergencyContactName: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,30}$/),
        emergencyContactPhone: Joi.string().trim().regex(/^[NA0-9\_]{3,12}$/),
        /**REGISTER
         * 
         */
        email: Joi.string().email({ minDomainAtoms: 2 }),
        password: Joi.string().trim().regex(/^[a-zA-Z0-9]{1,15}$/),
        password_confirm: Joi.string().trim().regex(/^[a-zA-Z0-9]{1,15}$/),
        identityCardNumber: Joi.string().trim().regex(/^[NA0-9\_]{3,12}$/),
        nationality: Joi.string().trim().regex(/^[a-zA-Z0-9\ \_]{3,12}$/),
        marriageStatus: Joi.string().trim().regex(/^[a-zA-Z]{5,7}$/).valid('Single', 'Married', 'Other'),
        // email: Joi.string().email({ minDomainAtoms: 2 })
    });
    // });.with('username', 'birthyear').without('password', 'access_token');

    // Return result.
    // log(data);
    const result = Joi.validate(req.body, schema);
    // result.error === null -> valid
    if (result.error !== null) {
        log(result.error.details[0].message);
        return res.send(result.error.details[0].message);

    }
    next();

    // You can also pass a callback which will be called synchronously with the validation result.
    // Joi.validate({ username: 'abc', birthyear: 1994 }, schema, function (err, value) { });  // err === null -> valid


};

