const mongoose = require('mongoose');
bcrypt = require('bcryptjs');
const Schema = new mongoose.Schema({
    NAME : { type: String, required : true,unique:true},
    MDP : { type: String, required : true },
    GOD :{type:Boolean,default:false}
});
const ADMINS = mongoose.model('ADMINS' , Schema);
module.exports = ADMINS;