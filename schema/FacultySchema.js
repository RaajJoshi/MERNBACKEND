const jwt = require('jsonwebtoken');
const { use } = require('express/lib/router');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const facSchema = new mongoose.Schema({
    fname : {
        type: String,
        required: true
    },
    lname : {
        type: String,
        required: true
    },
    userID : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    phone : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    cnfpasswd : {
        type: String,
        required: true
    },
    isIncharge : {
        type: String,
        required: true
    },
    lab : {
        type: String,
        required: false
    },
    classroom : {
        type: String,
        required: false
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

facSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        this.cnfpasswd = await bcrypt.hash(this.cnfpasswd,12);
    }
    next();
});

facSchema.methods.generateAuthToken = async function () {
    try{
        let tokenid = jwt.sign({_id:this._id},process.env.SK);
        this.tokens = this.tokens.concat({token:tokenid});
        await this.save();
        return tokenid;
    }catch(err){
        console.log(err);
    }
};

const FacultyInfo = mongoose.model('FACULTIES',facSchema);

module.exports = FacultyInfo;