const mongoose = require('mongoose');

const modmailSchema = new mongoose.Schema({
    user: String,
  

});

const modmail = mongoose.model('modmail', modmailSchema);

module.exports = modmail;