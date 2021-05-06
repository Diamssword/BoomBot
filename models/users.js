const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    NAME : { type: String, required : true,unique:true},
    MDP : { type: String, required : true },
    CODE : { type: String, required : true },
    DISCORD : { type: String},
    GOD :{type:Boolean,default:false},
    SOUNDBOARDS:{type:[mongoose.Schema.Types.ObjectId],ref:"SOUNDBOARDS",required:true},
    SAVED_BOARDS:{type:[mongoose.Schema.Types.ObjectId],ref:"SOUNDBOARDS",required:true},
    LASTBOARD:{type:Number}
});
const USERS = mongoose.model('USERS' , Schema);
module.exports = USERS;