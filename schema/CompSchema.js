const jwt = require('jsonwebtoken');
const { use } = require('express/lib/router');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CompSchema = new mongoose.Schema({
    comptype : {
        type: String,
        required: true
    },
    resno : {
        type: String,
        required: true
    },
    eqtype : {
        type: String,
        required: true
    },
    eqno : {
        type: String,
        required: false
    },
    abeq : {
        type: String,
        required: true
    },
    status : {
        type: String,
        required: true
    },
    userID : {
        type: String,
        required: true
    }
});


const AddComp = mongoose.model('COMPLAINTS',CompSchema);

module.exports = AddComp;