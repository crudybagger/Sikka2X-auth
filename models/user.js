// make a user model that will login using phone number
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('User', userSchema);