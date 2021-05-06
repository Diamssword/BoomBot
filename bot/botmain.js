const Discord = require('discord.js');
const USERS = require('../models/users');
const path = require('path');
console.log("[BOT] ► Starting discord bot...");
const client = new Discord.Client();
client.on('ready', () => {
  console.log(`[BOT] ► Logged in as ${client.user.tag}!`);
});
client.on('voiceStateUpdate', (oldState, newState) => {
  if(connectedUsers[newState.id])
  {
    if(!newState.channel && oldState.channel)
    {
      connectedUsers[newState.id].disconnect();
      delete connectedUsers[newState.id];
    }
  }});
client.on('message', msg => {
  if (msg.content.toLowerCase().startsWith('!dj link')) {
    let parts = msg.content.split(" ");
    if (parts.length >= 3) {
      USERS.findOne({ CODE: parts[2] }).exec((err, doc) => {
        if (doc) {
          doc.DISCORD = msg.author.id;
          doc.save();
          msg.channel.send("Linked Profile!");
          //.then((res)=>{res.createDM().then((res1)=>{res1.send("hey")})});
        }
        else {
          msg.channel.send("ERROR! No profile found!");
        }
      });
    }
  }
});
var cachedUsers = new Map();
var connectedUsers = {};
async function sendSound(id,soundPath) {
  var chid = cachedUsers.get(id);
  var guild = client.guilds.resolve(chid);
  if (guild) {
    let memb = guild.members.resolve(id);
    if (memb) {
      let channel = memb.voice.channel;
      if(channel)
      {
        playsound(id,channel,soundPath);
      }  
      else {
        fetchVoiceChannelFor(id,soundPath);
      }
    }
    else {
      fetchVoiceChannelFor(id,soundPath);
    }
  }
  else {
    fetchVoiceChannelFor(id,soundPath);
  }
}

async function playsound(id,channel,soundPath)
{

  console.log("play");
let connection =await channel.join();
let path1 =path.join(__dirname,"../shared_files",soundPath);
console.log(path1)
connectedUsers[id]=connection;
const dispatcher = connection.play(path1);
dispatcher.setVolume(1);
}
async function fetchVoiceChannelFor(id,soundPath) {
 client.guilds.cache.forEach(async (value) => {
    let memb = await value.members.resolve(id);
    if (memb) {
      if (memb.voice.channel) {
        cachedUsers.set(id, value.id);
        playsound(id,memb.voice.channel,soundPath);
        return;
      }
    }

  });
}
client.login(process.env.botToken);

module.exports={sendSound:sendSound}


