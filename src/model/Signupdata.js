
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://userone:userone@ictakfiles.jqw6w.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');

const Schema = mongoose.Schema;
const SignupSchema = new Schema({

    username : String,
    email : String,
    pass : String,
    number : String
});

var Signupdata = mongoose.model('signupdata',SignupSchema);

module.exports = Signupdata;