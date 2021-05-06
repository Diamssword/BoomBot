const mongoose = require('mongoose');
bcrypt = require('bcryptjs');
const Schema = new mongoose.Schema({
    OWNER:{type:mongoose.Schema.Types.ObjectId,ref:"USERS",required:true},
    LABEL : { type: String, required : true},
    TYPE : { type: String, required : true },
    PATH :{type:String,required:true}
});
const SOUNDS = mongoose.model('SOUNDS' , Schema);
module.exports = SOUNDS;