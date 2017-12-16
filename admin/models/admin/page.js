var mongoose = require('../../db.js');
var Schema = mongoose.Schema;

var PageSchema = new Schema({
    title: {type: String, required: true},
	  alias: {type: String, required: true},
    description: String,
    category: String,
    featured_image: String,
    created_by: Number,
    created_at: Date,
    updated_at: Date,
    active: Boolean
});

module.exports = mongoose.model('Page', PageSchema);
