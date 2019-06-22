const config = require("./botconfig")
const Discord = require("discord.js");
const bot = new Discord.Client({
  disableEverybody: true
})

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

bot.on("message", async message => {

  if (message.author.bot) return;


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
  } else
  if (cmd === `quranread`) {
    let msg = message.content.trim().replace(/ /g, "")
    if(msg == ''){
      let helpEmbed = new Discord.RichEmbed()
        .setColor("RED")
        .setTitle('quranread')
        .setDescription('Description: Prints a verse from the specified chapter of the quran \nUsage: !quranread chapter verse \nExample: !quranread 2 1')
      return message.channel.send(helpEmbed)
    }
    if (!args[0]) return message.channel.send('You forgot the chapter')
    if (!args[1]) return message.channel.send('You didn\'t specify a verse')
    quran.select({
      chapter: args[0],
      verse: args[1]
    }, {
      language: 'en'
    }, function(err, verses) {
      if (!err) {
        let desc = ""
        let quranEmbed = new Discord.RichEmbed()
          .setColor("GREEN")
          .setTitle('Chapter ' + args[0])
        for (const verse of verses) {
          let compiler = 'Verse ' + verse.verse + ':\n\nEnglish: ' + verse.en + '\n\nArabic: ' + verse.ar
          desc = desc + compiler
        }
        quranEmbed.setDescription(desc)
        message.channel.send(quranEmbed)
      } else {
        let error = err.toString()
        let trimmed = error.trim().split(/ /g)
        let found = trimmed.find(function(element) {
          return element.includes('a.chapter')
        })
        let stuff = parseInt(found.slice(10, found.length))
        if(stuff > 114){
          return message.channel.send("Invalid Chapter, Valid Chapters: 1 - 114")
        } else {
          let error = err.toString()
          let trimmed = error.trim().split(/ /g)
          let found2 = trimmed.find(function(element){
            return element.includes('a.verse')
          })
          let stuff2 = parseInt(found2.slice(8, found2.length))
          let max = verses
          if(stuff2 > max){
            return message.channel.send('Invalid Verse, try !quaranget ' + args[0] + ' to get all the avaliable verses for the chapter.')
          }
        }
      }
    });
  } else
  if(cmd === `quranget`){
    if (!args[0]) return message.channel.send('You forgot the chapter')
    quran.select({
      chapter: args[0]
    }, {
      language: 'en'
    }, function(err, verses) {
      if (!err) {
        let min = verses[0]
        min = min.verse
        let max = verses.pop()
        max = max.verse
        message.channel.send('Avaliable verses for chapter ' + args[0] + ' are: ' + min + ' - ' + max)
      } else {
        let error = err.toString()
        let trimmed = error.trim().split(/ /g)
        let found = trimmed.find(function(element) {
          return element.includes('a.chapter')
        })
        let stuff = parseInt(found.slice(10, found.length))
        if(stuff > 114){
          return message.channel.send("Invalid Chapter, Valid Chapters: 1 - 114")
        }
      }
    })
  }
});

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));

bot.login(process.env.token);
