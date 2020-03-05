'use strict'
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var log = console.log;
// var data = require("./recordData");
// log(data);
// var findUser = {
//     firstName: "Hue",
//     lastName: "Tran",
//     dateOfBirth: "24/12/1997",
//     gender: "Male",
//     identityCardNumber: "11111111",
//     ethnicity: "Kinh"
// }
mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    //neu ket noi khong thanh cong thi in ra loi
    if (err) throw err;
    //neu thanh cong thi log ra thong bao
    console.log('Ket noi thanh cong');

    var dbase = db.db("Cho-Ray-Hospital"); //here
    console.log('ket noi db thanh cong');

    // dbase.createCollection('array', function (err, res) {
    //     //Neu co loi thi in ra
    //     if (err) throw err;
    //     console.log('Tao thanh cong collection');
    // });


    // var user = dbase.collection('user');
    var record = dbase.collection('records');

    // record.insertOne(data, function (err, res) {
    //     if (err) throw err;
    //     //neu khong co loi

    //     console.log('Them thanh cong');
    //     db.close();
    //     //console.log(res);
    // });

    record.find({ patientid: "5d79a58948b90119e816cee9" }).toArray((err, result) => { //Khong có: [], 
        if (err) throw err;
        log(result[0]);
        // if (typeof (result[0] ) === "undefined") {
        //     log("khong co");
        // } else {
        //     log("co day");
        // }
        // var id = null;
        // for (var i in result) {
        //     id = result[i]._id;
        //     user.updateOne({ _id: id }, { $set: { isSend: true } }, function (err, result) {
        //         if (err) throw err;
        //         log("update success");
        //     });
        // };
        db.close();
    });

    // record.deleteOne({__id:"5d799b8b9e56203f3b2c2e92"})

    // user.findOne({
    //     firstName: findUser.firstName,
    //     lastName: findUser.lastName,
    //     dateOfBirth: findUser.dateOfBirth,
    //     gender: findUser.gender,
    //     identityCardNumber: findUser.identityCardNumber,
    //     ethnicity: findUser.ethnicity
    // }, function (err, result) { //khong co user => result = null
    //     if (err) throw err;
    //     // log(result);
    //     var patient = result._id.toString();
    //     record.find({ patientid: patient, isSend: false }).toArray((err, res) => {
    //         if (err) throw err;
    // if (typeof (result[0] ) === "undefined") {
    //     log("khong co");
    // } else {
    //     log("co day");
    // }
    //         var id = null;
    //         for (var i in res) {
    //             id = res[i]._id;
    //             record.updateOne({ _id: id }, { $set: { isSend: true } }, function (err, r) {
    //                 if (err) throw err;
    //                 log("update success");
    //             });
    //         };
    //         db.close();
    //     });
    // });

    // user.findAndModify({ patientid: "5d5fbcfecce97c3250617d44", isSend: false },  { $set: { isSend: true } }, function (err, res) {
    //     //nếu có lỗi
    //     if (err) throw err;
    //     //nếu thành công
    //     // console.log("find an object");
    //     // console.log(res);
    //     db.close();
    // });

    // user.updateOne({patientid: "5d5fbcfecce97c3250617d44"}, {$set: { isSend: false}}, function (err,res) {
    //     if (err) throw err;
    //     console.log('update success records');
    //     db.close();
    // });

});
