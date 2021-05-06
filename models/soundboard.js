const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    SOUNDS:{type:Object,required:true},
    LABEL : { type: String, required : true},
    CODE : { type: String, required : true },
});
const SOUNDS = mongoose.model('SOUNDBOARDS' , Schema);

module.exports = SOUNDS;