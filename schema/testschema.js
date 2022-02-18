const jwt = require('jsonwebtoken');
const { use } = require('express/lib/router');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TestSchema = new mongoose.Schema({
    labno : {
        type: String,
        required: true
    },
    pcno : {
        type: String,
        required: true
    },
});

/*
AddInfoSchema.methods.generateAuthToken = async function () {
    try{
        let tokenid = jwt.sign({_id:this._id},process.env.SK);
        this.tokens = this.tokens.concat({token:tokenid});
        await this.save();
        return tokenid;
    }catch(err){
        console.log(err);
    }
};
*/

const TestLab = mongoose.model('TESTLAB',TestSchema);

module.exports = TestLab;