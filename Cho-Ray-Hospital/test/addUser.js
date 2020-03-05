var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
// var data = [
//     { "firstName": "patient", "lastName": "patient", "dateOfBirth": "patient", "gender": "Male", "identityCardNumber": "patient", "ethnicity": "Kinh" },
//     { "firstName": "Hue", "lastName": "Tran", "dateOfBirth": "24/12/1997", "gender": "Male", "identityCardNumber": "11111111", "ethnicity": "Kinh" },
//     { "firstName": "Truc", "lastName": "Nguyen", "dateOfBirth": "10/01/1997", "gender": "Male", "identityCardNumber": "22222222", "ethnicity": "Kinh" },
//     { "firstName": "Nhung", "lastName": "Nguyen", "dateOfBirth": "18/01/1997", "gender": "Female", "identityCardNumber": "33333333", "ethnicity": "Kinh" },
//     { "firstName": "Tien", "lastName": "Pham", "dateOfBirth": "01/01/1997", "gender": "Male", "identityCardNumber": "44444444", "ethnicity": "Kinh" },
//     { "firstName": "Ngan", "lastName": "Ta", "dateOfBirth": "02/01/1997", "gender": "Female", "identityCardNumber": "55555555", "ethnicity": "Kinh" },
//     { "firstName": "Chi", "lastName": "Le", "dateOfBirth": "03/01/1997", "gender": "Female", "identityCardNumber": "66666666", "ethnicity": "Kinh" },
//     { "firstName": "Ha", "lastName": "Dang", "dateOfBirth": "04/01/1997", "gender": "Female", "identityCardNumber": "77777777", "ethnicity": "Kinh" },];

var data = [{ "firstName": "patient", "lastName": "patient", "dateOfBirth": "patient", "gender": "Male", "identityCardNumber": "patient", "ethnicity": "Kinh" }];
add(data);
function add(data) {
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        //neu ket noi khong thanh cong thi in ra loi
        if (err) throw err;
        //neu thanh cong thi log ra thong bao
        console.log('Ket noi thanh cong');

        var dbase = db.db("Cho-Ray-Hospital"); //here
        console.log('ket noi db thanh cong');

        // dbase.createCollection('user', function (err, res) {
        //     //Neu co loi thi in ra
        //     if (err) throw err;
        //     console.log('Tao thanh cong collection');   
        // });

        var user = dbase.collection('users');
        user.insertMany(data, function(err,res){
            if (err) throw err;
            //neu khong co loi
            console.log('Them thanh cong');
            //console.log(res);
        });


        // //lấy tất cả các dữ liệu trong collection user
        // user.find({
        //     firstName: 'Hue',
        //     lastName: 'Tran',
        //     dateOfBirth: '24/12/1997',
        //     gender: 'Male',
        //     identityCardNumber: '11111111',
        //     ethnicity: 'Kinh'
        // }, { _id: 0, firstName: 1 }).toArray((err, items) => {
        //     if (err) console.log(err);
        //     console.log(items[0]._id);
        //     db.close();
        // });

    });
    // console.log(typeof(data));


}





