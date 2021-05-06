const SOUNDS = require("./models/sounds");

module.exports={genRandom:genRandom,populateSounds:populateSounds}
function genRandom(n) {
    let result = '';
    let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charL = char.length;

    for (let i = 0; i < n; i++) {
        result += char.charAt(Math.floor(Math.random() * charL));
    }
    return result;
};

async function populateSounds(boards) {
    for(l in boards)
    {
    for (k in boards[l].SOUNDS) {
        boards[l].SOUNDS[k] = await SOUNDS.findOne({ _id: boards[l].SOUNDS[k] }).exec();
    }
}
}