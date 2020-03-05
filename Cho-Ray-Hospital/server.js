const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;
var log = console.log;

var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var record = null;
var user = null;
var db = mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    //neu ket noi khong thanh cong thi in ra loi
    if (err) throw err;
    //neu thanh cong thi log ra thong bao
    console.log('Ket noi thanh cong');
    var dbase = db.db("Cho-Ray-Hospital");
    record = dbase.collection('records');
    user = dbase.collection('users');

});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', (req, res) => {
    res.send(`Listening on ${PORT}`);
})

app.post('/user', (req, res) => {
    user.findOne({
        firstName: req.body.firstName.toString(),
        lastName: req.body.lastName.toString(),
        dateOfBirth: req.body.dateOfBirth.toString(),
        gender: req.body.gender.toString(),
        identityCardNumber: req.body.identityCardNumber.toString(),
        ethnicity: req.body.ethnicity.toString()
    }, function (err, result1) { //khong co user => result = null
        if (err) {
            // res.send({ success: false });
            throw err;
        }
        // log(result1);
        if (result1 == null) {
            res.send({ success: false, data: "Khong co benh nhan nay trong benh vien" });
            return;
        }
        var patient = result1._id.toString();
        record.find({ patientid: patient, isSend: false }).toArray((err, result2) => {
            if (err) throw err;
            if (typeof (result2[0]) === "undefined") {
                // log("khong co");
                res.send({ success: false, data: "Khong co record trong Benh vien Cho Ray" });
                return;
            }
            
            
            var id = null;
            log(result2[0]._id);
            for (var i in result2) {
                id = result2[i]._id;
                record.updateOne({ _id: id }, { $set: { isSend: true } }, function (err, r) {
                    if (err) throw err;
                    log("update success");
                });
            };
            for(var i in result2){
                delete result2[i]["_id"];
                delete result2[i]["patientid"];
                delete result2[i]["isSend"];

            }
            return res.send({ success: true, data: result2 });
        });
    });

});