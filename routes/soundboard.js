const { ensureAuthenticated } = require('../config/auth');
const SOUNDS = require('../models/sounds');
const SOUNDBOARDS = require('../models/soundboard');
const path = require('path');
const fs = require('fs');
const USERS = require('../models/users');
const sendSound = require('../bot/botmain').sendSound;
const populateSounds = require('../utils').populateSounds;
async function route(router) {
    router.get('/soundboard', ensureAuthenticated, async (req, res) => {
        const user = await USERS.findOne({ _id: req.session.passport.user }).populate({ path: 'SOUNDBOARDS', model: 'SOUNDBOARDS' }).exec();

       await populateSounds(user.SOUNDBOARDS);
       await populateSounds(user.SAVED_BOARDS);
        res.render('soundboard.ejs',{
            boards:user.SOUNDBOARDS.concat(user.SAVED_BOARDS)
        });
    });
}

function socket(socket) {
    socket.on("soundboard.sendCode", async data => {

        socket.emit("toast", { msg: { type: "success", text: "Soundboard Chargée" } });

        var doc = await SOUNDBOARDS.findOne({ CODE: data }).populate({ path: 'SOUNDS', model: 'SOUNDS' }).exec();
        if (doc) {
            socket.emit("soundboard.sendSoundboard", doc);
        }
        const user = await USERS.findOne({ _id: socket.handshake.session.passport.user }).exec();
        if (user) {
            if (!user.SAVED_BOARDS)
                user.SAVED_BOARDS = [];
            if(!user.SAVED_BOARDS.contains(doc._id) &&user.SOUNDBOARDS.contains(doc._id))
            {
                user.SAVED_BOARDS.push(doc._id);
                user.markModified("SAVED_BOARDS");
                user.save();
            }
        }
    });
    socket.on("soundboard.play", async data => {
        try {
            const sound = await SOUNDS.findOne({ _id: data }).exec();
            if (!socket.handshake.session.discordID) {
                const user = await USERS.findOne({ _id: socket.handshake.session.passport.user }).exec();
                if (user) {
                    socket.handshake.session.discordID = user.DISCORD;
                    socket.handshake.session.save();
                }
            }
            if (socket.handshake.session.discordID) {
                sendSound(socket.handshake.session.discordID, socket.handshake.session.passport.user + "/" + sound.PATH);
            }

        } catch (err) { console.log(err) }
    });
    socket.on("soundboard.delete", async data => {
                const user = await USERS.findOne({ _id: socket.handshake.session.passport.user }).exec();
                if (user) {
                    var po=user.SAVED_BOARDS.indexOf(data);
                    if(po>=0)
                    {
                        user.SAVED_BOARDS.slice(po,1);
                        user.markModified("SAVED_BOARDS");
                        user.save();
                    }
                }
    });
}
module.exports = { route: route, socket: socket };