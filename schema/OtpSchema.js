const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true
    },
    otp : {
        type: String,
        required: true
    },
});



const TestOtp = mongoose.model('OTP',OtpSchema);

module.exports = TestOtp;