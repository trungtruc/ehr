const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true, required: true, trim: true},
    password: { type: String, required: true },
    cardName: { type: String, required: true, max: 14, min: 12 },
    createAt: { type: String, min: 8, ma: 10 },
    role: { type: String, enum: ['Doctor', 'Patient'], default: 'Patient' },
    isDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);