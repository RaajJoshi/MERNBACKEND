const jwt = require('jsonwebtoken');
const { use } = require('express/lib/router');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FeedbackSchema = new mongoose.Schema({
    feedback : {
        type: String,
        required: true
    },
    userID : {
        type: String,
        required: true
    },
    fname : {
        type: String,
        required: true
    },
    lname : {
        type: String,
        required: true
    }
});


const Fdbk = mongoose.model('FEEDBACKS',FeedbackSchema);

module.exports = Fdbk;