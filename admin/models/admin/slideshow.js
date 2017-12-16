var mongoose = require('../../db.js');
var Schema = mongoose.Schema;

var SlideshowSchema = new Schema({
    title: {type: String, required: true},
	  image_name: {type: String, required: true},
    position: Number,
    created_by: Number,
    created_at: Date,
    updated_at: Date,
    active: Boolean
});

module.exports = mongoose.model('Slideshow', SlideshowSchema);
