var mongoose = require('../../db.js');
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
    name: {type: String, required: true},
    pages:[],
    created_by: Number,
    created_at: Date,
    updated_at: Date,
    active: Boolean
});

module.exports = mongoose.model('Menu', MenuSchema);
