var mongoose = require('../../db.js');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    category_name: {type: String, required: true, unique:true},
    created_at: Date,
    updated_at: Date,
    active: Boolean
});

module.exports = mongoose.model('Category', CategorySchema);
