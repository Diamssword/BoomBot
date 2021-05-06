const { ensureAuthenticated } = require('../config/auth');
const SOUNDS = require('../models/sounds');
const SOUNDBOARDS = require('../models/soundboard');
const path = require('path');
const fs = require('fs');
const USERS = require('../models/users');
const populateSounds = require('../utils').populateSounds;
async function route(router) {
    router.get('/manager', ensureAuthenticated, async (req, res) => {
        let sounds = await SOUNDS.find({ OWNER: req.session.passport.user }).exec();
        let user = await USERS.findOne({ _id: req.session.passport.user }).populate({ path: 'SOUNDBOARDS',model: 'SOUNDBOARDS'}).exec();
        await populateSounds(user.SOUNDBOARDS)
        res.render('manager.ejs', { sounds: sounds, user: user });
    });

    router.post('/manager', async (req, res, next) => {
    });
}

function socket(socket) {
    socket.on("manager.sendFiles", async data => {

        socket.emit("toast", { msg: { type: "success", text: "Fichiers envoyés" } });
        let files = await uploadFiles(data, socket.handshake.session.passport.user);
        for (k in files) {
            await new SOUNDS({ OWNER: socket.handshake.session.passport.user, LABEL: files[k].name, TYPE: files[k].ext, PATH: files[k].path }).save();
        }
    });
    socket.on("manager.updateSoundBoard", async data => {


        const user = await USERS.findOne({ _id: socket.handshake.session.passport.user }).exec();
        var pos = user.SOUNDBOARDS.indexOf(data._id);
        if (pos == -1) {
            const d = new Date();
            const str = d.getFullYear().toString().substring(2)+d.getMonth().toString()+d.getDay().toString()+d.getHours().toString()+d.getMinutes().toString();
            data.CODE = str;
            let newb = await new SOUNDBOARDS(data).save();
            socket.emit('manager.sendNewSoundBoard', newb);
            user.SOUNDBOARDS.push(newb._id);
            user.markModified("SOUNDBOARDS");
            user.save();
        }
        else {
            let doc =await SOUNDBOARDS.findOne({ _id: data._id } ).exec();
            for(k in data.SOUNDS)
            {
                if (data.SOUNDS[k] && data.SOUNDS[k] != null) {
                if(data.SOUNDS[k]._id)
                data.SOUNDS[k]=data.SOUNDS[k]._id;
                }
            }
            doc.SOUNDS= data.SOUNDS
            doc.LABEL = data.LABEL;
            doc.markModified("SOUNDS");
            doc.save();
        }
    });
    socket.on("manager.rename", async data => {
        var user =await USERS.findOne({_id:socket.handshake.session.passport.user}).exec();
        if(user && user.SOUNDBOARDS.includes(data.id))
        {

        let board =await SOUNDBOARDS.findOne({_id:data.id}).exec();
        board.LABEL=data.label;
        board.save();
        }
    });
    socket.on("manager.delete", async data => {
        var user =await USERS.findOne({_id:socket.handshake.session.passport.user}).exec();
        if(user && user.SOUNDBOARDS.includes(data))
        {
            SOUNDBOARDS.deleteOne({_id:data}).exec();
        }
    });
}
function uploadFiles(files, id) {

    const userFolder = path.join(__dirname + '/../shared_files/' + id);

    if (!fs.existsSync(userFolder)) {
        if (!fs.existsSync(path.join(__dirname + '/../shared_files/')))
            fs.mkdirSync(path.join(__dirname + '/../shared_files/'));
        fs.mkdirSync(userFolder);
    }

    for (k in files) {
        const date = new Date();
        const code = date.getDay() + "" + date.getMonth() + "" + (date.getFullYear() - 2000) + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + k;
        files[k].path = code + "." + files[k].ext;
        fs.writeFile(userFolder + "/" + code + "." + files[k].ext, files[k].data, (err) => { if (err) console.log(err) });
        delete files[k].data;
    }
    return files;

}
module.exports = { route: route, socket: socket };