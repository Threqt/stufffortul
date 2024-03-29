const config = require("./botconfig")
const Discord = require("discord.js");
const bot = new Discord.Client({
  disableEverybody: true
})
const db = require('quick.db')

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("sirens", {
    type: "LISTENING"
  });
});

bot.on(`guildMemberAdd`, async member => {
  console.log(`User ` + member.user.username + ` has joined`)
  var role = member.guild.roles.find('name', 'Blind')
  member.addRole(role).catch(console.err)
});

let interval2 = false

bot.on("message", async message => {

  let counting = message.guild.channels.find("name", "counting")
  let number1 = db.fetch(`number_${message.guild.id}`)

  if(message.channel.name === counting.name){
    console.log(db.fetch(`number_${message.guild.id}`))
    console.log(message.content)
    if(number1 == null){
      db.set(`number`, 0)
    }
    if(message.content == number1 + 1){
      db.set(`number_${message.guild.id}`, number1 + 1)
      return message.channel.setTopic(`Next number is ${db.fetch(`number_${message.guild.id}`) + 1}`)
    } else {
      return message.delete()
    }
  }

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  // This is where we'll put our code.
  if (message.content.indexOf(config.prefix) !== 0) return;

  if (cmd === `ping`) {
    let msg = await message.channel.send("Testing ping...")
    msg.edit(`Pong! Latency is ${msg.createdAt - message.createdAt}ms. API Latency is ${Math.round(bot.ping)}ms.`)
  } else
  if (cmd === 'remove') {
    if(!message.author.id === 584011119048261673) return;
    let members = message.guild.members
    members.forEach(function(member){
      let role = message.guild.roles.find("name", "Blind")
      if(member.roles.has(role.id)){
        member.kick().catch(console.err)
        console.log(`Kicked ${member.user.username}`)
      } else {
        console.log("Skipped!")
      }
    })
  }
});

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));

bot.login(process.env.token);
