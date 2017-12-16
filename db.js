var mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/simplecms', { useMongoClient: true });
module.exports = mongoose;
