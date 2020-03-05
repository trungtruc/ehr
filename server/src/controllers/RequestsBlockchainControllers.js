const chalk = require('chalk');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const log = console.log;

module.exports = {
    createRequest, patientAcceptRequest, doctorAcceptRequest, patientRevokeRequest,
    doctorRevokeRequest, deleteRequest, getRequest, getRequestById
};

// var data = {
//     "requestID": "REQUEST2",
//     "requesterRole": "Patient",
//     "resourceOwnerRole": "Doctor",
//     "resourceType": "DoctorInformation",
//     "resourceID": "DOCTOR2",
//     "createdAt": "10/10/2019",
//     "owner": "PATIENT5",
//     "resourceOwner": "DOCTOR2"
// }
// var cardName = "PATIENT5@ehr";

// createRequest(cardName, data, data.requestID, data.requesterRole, data.createdAt, data.owner);
//okay
async function createRequest(cardName, data, requestID, requesterRole, createdAt, ownerID) {
    log(chalk.bgRed("Start creating a new request asset"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        //connect to bussiness network
        const definition = await businessNetworkConnection.connect(cardName);

        //add a new request asset
        let assetRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.ReadRequest');
        let factory = definition.getFactory();
        let asset = factory.newResource('org.uit.ehr', "ReadRequest", requestID);
        asset.requesterRole = requesterRole;
        asset.resourceType = data.resourceType;
        asset.resourceOwnerRole = data.resourceOwnerRole;
        asset.resourceID = data.resourceID;
        asset.createdAt = createdAt;
        asset.requestStatus = "Created";
        var owner = factory.newRelationship("org.uit.ehr", requesterRole, ownerID);
        asset.owner = owner;
        var resourceOwner = factory.newRelationship("org.uit.ehr", data.resourceOwnerRole, data.resourceOwner);
        asset.resourceOwner = resourceOwner;

        // // //add a new participant to business network
        await assetRegistry.add(asset);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Added a new request asset successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
    }
}


// patientAcceptRequest("PATIENT5@ehr", "REQUEST1");
//okay
async function patientAcceptRequest(cardName, requestID) {
    log(chalk.bgRed("Patient accepting a new request asset"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        //connect to bussiness network with cardName
        const definition = await businessNetworkConnection.connect(cardName);

        //get RequestRegistry by ID
        let requestRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.ReadRequest');
        var request = await requestRegistry.get(requestID);

        //get resource
        let resourceOwnerAsset = await businessNetworkConnection.getAssetRegistry("org.uit.ehr." + request.resourceType);
        var resource = await resourceOwnerAsset.get(request.resourceID);

        //get Doctor
        var doctor = request.owner;

        //add doctor into authorizedDoctors and update resourceRegistry
        await resource.authorizedDoctors.push(doctor);
        await resourceOwnerAsset.update(resource);
        request.requestStatus = "Accepted";
        await requestRegistry.update(request);


        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Add a new doctor into authorizedDoctors array in " + request.resourceType + "  with id: " + request.resourceID + " successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
    }
}

// var data = {
//     "requestID": "REQUEST2"
// };

// var cardName = "PATIENT1@ehr";

//okay
// doctorAcceptRequest("DOCTOR2@ehr", "REQUEST2");
async function doctorAcceptRequest(cardName, requestID) {
    log(chalk.bgRed("Doctor is accepting a new request asset"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        //connect to bussiness network with cardName
        await businessNetworkConnection.connect(cardName);

        //get RequestRegistry by ID
        let requestRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.ReadRequest');
        var request = await requestRegistry.get(requestID);

        //get resource
        // console.log(result);
        // log("resource : " + request.resourceType);
        let resourceOwnerAsset = await businessNetworkConnection.getAssetRegistry("org.uit.ehr." + request.resourceType);
        var resource = await resourceOwnerAsset.get(request.resourceID);

        //get Doctor
        var patient = request.owner;

        //add doctor into authorizedDoctors and update resourceRegistry
        await resource.authorizedPatients.push(patient);
        await resourceOwnerAsset.update(resource);

        request.requestStatus = "Accepted";
        await requestRegistry.update(request);


        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Add a new patietn into authorizedPatients array in " + request.resourceType + " successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
    }
}


// patientRevokeRequest("PATIENT5@ehr", "REQUEST1");
//okay
async function patientRevokeRequest(cardName, requestID) {
    log(chalk.bgRed("Patient start revoking a request asset"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        //connect to bussiness network with cardName
        await businessNetworkConnection.connect(cardName);

        //get RequestRegistry by ID
        let requestRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.ReadRequest');
        var request = await requestRegistry.get(requestID);

        //get resource
        // console.log(result);
        // log("resource : " + request.resourceType);
        let resourceOwnerAsset = await businessNetworkConnection.getAssetRegistry("org.uit.ehr." + request.resourceType);
        var resource = await resourceOwnerAsset.get(request.resourceID);

        //get Doctor
        var doctor = request.owner;

        //delete doctor in authorizedDoctors and update resourceRegistry
        await resource.authorizedDoctors.splice(resource.authorizedDoctors.indexOf(doctor, "1"));
        await resourceOwnerAsset.update(resource);

        request.requestStatus = "Rejected";
        await requestRegistry.update(request);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Revoked a doctor into authorizedDoctors array in " + request.resourceType + " successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
    }
}

//okay
// doctorRevokeRequest("DOCTOR1@ehr", "REQUEST1");
async function doctorRevokeRequest(cardName, requestID) {
    log(chalk.bgRed("Doctor start revoking a request asset"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        //connect to bussiness network with cardName
        const definition = await businessNetworkConnection.connect(cardName);

        //get RequestRegistry by ID
        let requestRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.ReadRequest');
        var request = await requestRegistry.get(requestID);

        //get resource
        // console.log(result);
        // log("resource : " + request.resoauthorizedDoctorsurceType);
        let resourceOwnerAsset = await businessNetworkConnection.getAssetRegistry("org.uit.ehr." + request.resourceType);
        var resource = await resourceOwnerAsset.get(request.resourceID);

        //get Doctor
        // var patient = null;
        var patient = request.owner;
        // log(patient);

        //delete doctor in authorizedDoctors and update resourceRegistry
        await resource.authorizedPatients.splice(resource.authorizedPatients.indexOf(patient, "1"));
        await resourceOwnerAsset.update(resource);
        request.requestStatus = "Rejected";
        await requestRegistry.update(request);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Revoked a patient into authorizedDoctors array in " + request.resourceType + " successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
    }
}


// deleteRequest("PATIENT1@ehr","REQUEST2");
//okay
async function deleteRequest(cardName, requestID) {
    log(chalk.bgRed("Start deleting a request asset"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        const definition = await businessNetworkConnection.connect(cardName);
        let requestRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.ReadRequest');
        // let factory = definition.getFactory();
        var request = await requestRegistry.get(requestID);
        // console.log(result);
        await requestRegistry.remove(request);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("Removed a request asset successfully"));
        return 1;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return 0;
    }
}

//xong
// getRequest("DOCTOR2@ehr");
async function getRequest(cardName) {
    log(chalk.bgRed("Start getting all request"));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect(cardName);
        let requestsRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.ReadRequest');
        var result = await requestsRegistry.getAll();
        // log(result[0]);
        var array = [];
        var info = null;
        for (var i in result) {
            info = {
                "requestID": result[i].requestID,
                "requesterRole": result[i].requesterRole,
                "resourceOwnerRole": result[i].resourceOwnerRole,
                "resourceType": result[i].resourceType,
                "resourceID": result[i].resourceID,
                "createdAt": result[i].createdAt,
                "owner": result[i].owner.getIdentifier(),
                "resourceOwner": result[i].resourceOwner.getIdentifier(),
                "requestStatus": result[i].requestStatus
            };
            array.push(info);
        }

        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(chalk.green("getted a doctor info asset successfully"));
        return array;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return null;
    }
}

//okay
// getRequestById("DOCTOR2@ehr", "REQUEST1");
async function getRequestById(cardName, requestID) {
    log(chalk.bgRed("Start getting a request by id: " + requestID + " with cardName: " + cardName));

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect(cardName);
        let requestRegistry = await businessNetworkConnection.getAssetRegistry('org.uit.ehr.ReadRequest');
        var result = await requestRegistry.get(requestID);
        // log(result);
        var info = null;
        info = {
            "requestID": result.requestID,
            "requesterRole": result.requesterRole,
            "resourceOwnerRole": result.resourceOwnerRole,
            "resourceType": result.resourceType,
            "resourceID": result.resourceID,
            "createdAt": result.createdAt,
            "owner": result.owner.getIdentifier(),
            "resourceOwner": result.resourceOwner.getIdentifier(),
            "requestStatus": result.requestStatus,
        };
        //disconect admin card
        await businessNetworkConnection.disconnect();
        log(info);
        log(chalk.green("getted a request successfully"));
        return info;
    } catch (error) {
        //error: trung id card
        console.error(error);
        await businessNetworkConnection.disconnect();
        return null;
    }
}
