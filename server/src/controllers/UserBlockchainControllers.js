const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { IdCard } = require('composer-common');
const AdminConnection = require('composer-admin').AdminConnection;
const chalk = require('chalk');
const log = console.log;
let adminConnection = new AdminConnection();

module.exports = { addParticipant, ping, isssueIdentity, importCard, exportCard, deleteCard, getParticipantInfo }

// var data = {
//     "personID": "PATIENT5",
//     "firstName": "patient",
//     "lastName": "patient",
//     "dateOfBirth": "patient",
//     "gender": "Male",
//     "identityCardNumber": "patient",
//     "ethnicity": "Kinh",
//     "nationality":"patient",
//     "specialist":"Cardiologist",
//     "marriageStatus": "Single",
//     "address": "patient",
//     "city": "patient",
//     "state": "patient",
//     "country": "patient",
//     "home": "N_A",
//     "work": "N_A",
//     "mobile": "patient"
// };

// var role = "Patient";


// async function main(data, role) {
//     let participantid = data.personID;
//     let cardname = participantid + '@ehr';

//     await addParticipant(data, role,participantid);
//     await isssueIdentity(participantid, role);
//     await ping(cardname);
//     const carddata = await exportCard(cardname);
//     await importCard(cardname, carddata);
//     //khong can delete card van duoc
//     // await deleteCard(cardname);
// }

// main(data, role);

//okay
async function addParticipant(data, Role, personID) {
    log(chalk.bgRed("Start creating a new " + Role + " as a participant"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        const definition = await businessNetworkConnection.connect('admin@ehr');
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.uit.ehr.' + Role);
        let factory = definition.getFactory();

        //define information of a user
        let participant = factory.newResource('org.uit.ehr', Role, personID);
        participant.firstName = data.firstName;
        participant.lastName = data.lastName;
        participant.dateOfBirth = data.day + "/" + data.month + "/" + data.year;
        participant.gender = data.gender;
        participant.identityCardNumber = data.identityCardNumber;
        participant.ethnicity = data.ethnicity;

        //add a new participdateOfBirthant to business network
        await participantRegistry.add(participant);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Add a new " + Role + " as a participant successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
        // process.exit(1);
    }
}

// addParticipant();

//okay
async function isssueIdentity(participantId, Role) {
    log(chalk.bgRed('Start issue identity with role: ' + Role));
    let businessNetworkConnection = new BusinessNetworkConnection();
    try {
        await businessNetworkConnection.connect('admin@ehr');
        const participantNS = 'org.uit.ehr.' + Role + "#" + participantId;
        const result = await businessNetworkConnection.issueIdentity(participantNS, participantId);
        console.log(`userID = ${result.userID}`);
        console.log(`userSecret = ${result.userSecret}`);
        let metadata = {
            userName: result.userID,
            version: 1,
            enrollmentSecret: result.userSecret,
            businessNetwork: "ehr"
        };

        let connectionprofile = {
            "name": "hlfv1",
            "x-type": "hlfv1",
            "x-commitTimeout": 300,
            "version": "1.0.0",
            "client": {
                "organization": "Org1",
                "connection": {
                    "timeout": {
                        "peer": {
                            "endorser": "300",
                            "eventHub": "300",
                            "eventReg": "300"
                        },
                        "orderer": "300"
                    }
                }
            },
            "channels": {
                "composerchannel": {
                    "orderers": ["orderer.example.com"],
                    "peers": {
                        "peer0.org1.example.com": {}
                    }
                }
            },
            "organizations": {
                "Org1": {
                    "mspid": "Org1MSP",
                    "peers": ["peer0.org1.example.com"],
                    "certificateAuthorities": ["ca.org1.example.com"]
                }
            },
            "orderers": {
                "orderer.example.com": {
                    "url": "grpc://localhost:7050"
                }
            },
            "peers": {
                "peer0.org1.example.com": {
                    "url": "grpc://localhost:7051"
                }
            },
            "certificateAuthorities": {
                "ca.org1.example.com": {
                    "url": "http://localhost:7054",
                    "caName": "ca.org1.example.com"
                }
            }
        };

        const newIdCard = new IdCard(metadata, connectionprofile);

        const directoryPath = `/home/daihue/.composer/cards/${participantId}@ehr`;

        await newIdCard.toDirectory(directoryPath);
        log(chalk.green('A new card created for ' + Role + ' with id: ' + participantId));
        businessNetworkConnection.disconnect();
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
        // process.exit(1);
    }

}


//okay
async function ping(cardName) {
    let businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(cardName).then(() => {
        return businessNetworkConnection.ping();
    }).then((result) => {
        console.log(`participant = ${result.participant ? result.participant : '<no participant found>'}`);
        return businessNetworkConnection.disconnect();
    }).catch((error) => {
        console.error(error);
        return 0;
    });
}

//okay
async function importCard(cardName, cardData) {
    log(chalk.bgRed('Start import a new card with name: ' + cardName));
    try {
        await adminConnection.connect('admin@ehr');
        await adminConnection.importCard(cardName, cardData);
        console.log(chalk.green('Card is imported!'));
        await adminConnection.disconnect();
    } catch (error) {
        console.log(chalk.red.bold(error));
        await adminConnection.disconnect();
        return 0;
    }
}
//okay
async function exportCard(cardName) {
    log(chalk.bgRed('Start export card ' + cardName));
    try {
        await adminConnection.connect('admin@ehr');
        const cardData = await adminConnection.exportCard(cardName);
        log(chalk.green(`Card name ${cardName} is exported!`));
        await adminConnection.disconnect();
        return cardData;
    } catch (error) {
        console.log(chalk.red.bold(error));
        await adminConnection.disconnect();
        return 0;
    }
}
//okay
async function deleteCard(cardName) {
    console.log(chalk.bgRed('Start delete card!' + cardName));
    try {
        await adminConnection.connect('admin@identity');
        await adminConnection.deleteCard(cardName);
        console.log(chalk.green('Card ' + cardName + ' is deleted!'));
        await adminConnection.disconnect();
        return 1;
    } catch (error) {
        console.log(chalk.red.bold(error))
        await adminConnection.disconnect();
        return 0;
    }
}

//function okay
// getParticipantInfo("PATIENT5@ehr", "Patient");
async function getParticipantInfo(cardName, Role) {
    log(chalk.bgRed("Start get info of " + Role + " with cardName: " + cardName));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect(cardName);
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.uit.ehr.' + Role);

        //add a new participant to business network
        var result = await participantRegistry.getAll();
        // log(result);
        //disconect admin card
        await businessNetworkConnection.disconnect();
        var user = null;
        user = {
            "id": result[0].getIdentifier(),
            "firstName": result[0].firstName,
            "lastName": result[0].lastName,
            "dateOfBirth": result[0].dateOfBirth,
            "gender": result[0].gender,
            "identityCardNumber": result[0].identityCardNumber,
            "ethnicity": result[0].ethnicity
        };
        // console.log(user);
        return user;
    } catch (error) {
        //error: trung id card
        await businessNetworkConnection.disconnect();
        console.error(error);
        // process.exit(1);
    }
}

// getParticipantInfo("DOCTOR1@ehr", "Doctor");

//function chua xu ly // khong can thiet lam
async function getParticipantInfoById(id, onSucess) {
    console.log("start get participant info by id");

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        // await businessNetworkConnection.connect('3@identity');
        await businessNetworkConnection.connect("admin@identity");
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('identity.uit.citynow.User');


        //add a new participant to business network
        var result = await participantRegistry.get(id)

        //disconect admin card
        await businessNetworkConnection.disconnect();
        // console.log(result);
        var user = {
            idCardNumber: result.idcardNumber,
            fullname: result.fullname,
            dateOfBirth: result.dateOfBirth,
            email: result.email,
            country: result.country,
            address: result.address,
            phoneNumber: result.phoneNumber
        };
        console.log(user);
        onSucess({ data: user });
        return;
    } catch (error) {
        await businessNetworkConnection.disconnect();
        var user = {
            idCardNumber: "",
            fullname: "",
            dateOfBirth: "",
            email: "",
            country: "",
            address: "",
            phoneNumber: ""
        };
        onSucess({ data: user });
        return;
    }
}


// async function main(data) {
//     let participantId = 'TRADER999';
//     let cardName = participantId+'@identity';

//     await bc.addParticipant(data);
//     await bc.isssueIdentity(data.idCardNumber);
//     var cardName = data.idCardNumber + "@identity";
//     await bc.ping(cardName);
//     const cardData = await exportCard(cardName);
//     await bc.deleteCard(cardName);
//     await importCard(cardName, cardData);
//     // process.exit();
//     // res.send("done");
// }

// main();


