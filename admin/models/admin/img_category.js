var mongoose = require('../../db.js');
var Schema = mongoose.Schema;

var ImgCategorySchema = new Schema({
    category_name: {type: String, required: true},
    bigger_img_height: Number,
    bigger_img_width: Number,
    thumb_img_height: Number,
    thumb_img_width: Number,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('ImgCategory', ImgCategorySchema);
