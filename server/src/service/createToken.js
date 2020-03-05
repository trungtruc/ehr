async function Authentication(data) {

    var token = jwt.sign(user, config.secret, {
        expiresIn: 3600 //seconds
    });


}