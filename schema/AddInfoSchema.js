const jwt = require('jsonwebtoken');
const { use } = require('express/lib/router');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AddInfoSchema = new mongoose.Schema({
    labno : {
        type: String,
        required: true
    },
    pcno : {
        type: String,
        required: true
    },
    chrno : {
        type: String,
        required: true
    },
    acno : {
        type: String,
        required: true
    },
    fanno : {
        type: String,
        required: true
    },
    lightno : {
        type: String,
        required: true
    },
    ethr : {
        type: String,
        required: true
    },
    projc : {
        type: String,
        required: true
    },
    projno : {
        type: String,
        required: false
    },
    projnm1 : {
        type: String,
        required: false
    },
    projnm2 : {
        type: String,
        required: false
    },
    Incharge : {
        type: String,
        required: true
    }
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

const Addinfo = mongoose.model('ADDRESOURCES',AddInfoSchema);

module.exports = Addinfo;