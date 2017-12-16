var mongoose = require('../../db.js');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new Schema({
    email: {type: String, required: true, unique:true},
    firstName: String,
    lastName: String,
    password: String,
    created_at: Date,
    updated_at: Date,
    active: Boolean
});

UserSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

module.exports = mongoose.model('User', UserSchema);
