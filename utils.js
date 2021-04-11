module.exports={genRandom:genRandom}
function genRandom(n) {
    let result = '';
    let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charL = char.length;

    for (let i = 0; i < n; i++) {
        result += char.charAt(Math.floor(Math.random() * charL));
    }
    return result;
};