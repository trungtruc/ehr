//enum in JOI: https://stackoverflow.com/questions/50156176/how-to-use-enum-values-with-joi-string-validation
const log = console.log;
const Joi = require("joi");

var data = {
    username: "aaaaa",
    password: "aass",
    access_token: [{username:"hue", password:"1234567"},{username:"huse", password:"123c4567"}],
    birthyear: "2003",
    type: "ios",
    email: "a@gmail.com"
};

exports.UserValidator = function (req, res, next) {
	//schema: joi.object().keys({
   // this_is_an_array: joi.array([{
    //    id: joi.number().required(),
   //     name: joi.string().required()
   // }])
//})

    const obj = Joi.object({
        username: Joi.string().alphanum().min(3).max(16).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).min(6).required()
    }).with('username', 'password');

    // const arr = Joi.array().items(Joi.string(), Joi.number());
    const arr = Joi.array().items(obj).min(1).unique();

    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        access_token: arr,
        birthyear: Joi.number().integer().min(1900).max(2013),
        type: Joi.string().valid('ios', 'android'),
        email: Joi.string().email({ minDomainAtoms: 2 })
    });
    // });.with('username', 'birthyear').without('password', 'access_token');

    // Return result.
    log(data);
    const result = Joi.validate(data, schema);
    // result.error === null -> valid
    if (result.error !== null) {
        return res.send(res.error);
    }
    next();

    // You can also pass a callback which will be called synchronously with the validation result.
    // Joi.validate({ username: 'abc', birthyear: 1994 }, schema, function (err, value) { });  // err === null -> valid
	
	
};