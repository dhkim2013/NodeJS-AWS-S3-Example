var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    pw: String,
    imageUrl: String
});

module.exports = mongoose.model('user', userSchema);
