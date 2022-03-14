const jwt = require('jsonwebtoken');
const { use } = require('express/lib/router');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AddInfoSchemaClass = new mongoose.Schema({
    classno : {
        type: String,
        required: true
    },
    benchno : {
        type: String,
        required: true
    },
    fannno : {
        type: String,
        required: true
    },
    tubelightno : {
        type: String,
        required: true
    },
    projec : {
        type: String,
        required: true
    },
    Inchargeclass : {
        type: String,
        required: true
    },
    tokens:[
        {
            token:{
                type: String,
                required: true
            }
        }
    ]
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

const AddinfoClass = mongoose.model('ADDRESOURCESCLASS',AddInfoSchemaClass);

module.exports = AddinfoClass;