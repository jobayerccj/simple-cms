var mongoose = require('../../db.js');
var Schema = mongoose.Schema;

var SettingsSchema = new Schema({
    setName: {type: String, required: true, unique:true},
    setValue: String,
    updated_at: Date
});


module.exports = mongoose.model('Setting', SettingsSchema);
