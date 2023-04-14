require("dotenv").config();

const Discord = require("discord.js");
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL;
const INTERVAL = process.env.INTERVAL;
const PORT = process.env.PORT;

bot.login(TOKEN);

var channel;
var interval;
var ip;

async function ip_message() {
  let ipcheck = await import("public-ip");
  return (
    "Current Server ip:\t" +
    (await ipcheck.publicIp({onlyHttps:true})) + 
    ".\n*Port:*\t" + PORT + '.'
  );
}

async function post_ip() {
  await channel.bulkDelete(5);
  await channel.send(await ip_message());
}

async function check_ip() {
  let ipcheck = await import("public-ip");
  var temp_ip = await ipcheck.publicIp({onlyHttps:true});
  if (temp_ip !== ip) {
    ip = temp_ip;
    await post_ip();
  }
}

async function con_Log() {
  let ip = await import("public-ip");
  console.log(await ip.publicIp({onlyHttps:true}));
}

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);

  con_Log();

  channel = bot.channels.get(CHANNEL);

  interval = setInterval(function() {
    check_ip().catch(function(reason) {
      console.log(reason);
    });
  }, INTERVAL);
});

bot.on("message", msg => {
  if (msg.channel === channel && msg.author !== bot.user) {
    post_ip();
  }
});

bot.on("resume", function() {
  channel = bot.channels.get(CHANNEL);

  interval = setInterval(function() {
    check_ip().catch(function(reason) {
      console.log(reason);
    });
  }, INTERVAL);
});

bot.on("disconnected", function() {
  clearInterval(interval);
});
