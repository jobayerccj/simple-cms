var mongoose = require('../../db.js');
var Schema = mongoose.Schema;

var ImageAlbumSchema = new Schema({
    album_name: {type: String, required: true},
    category_name: String,
    description: String,
    status: Number,
    images:[],
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('ImageAlbum', ImageAlbumSchema);
