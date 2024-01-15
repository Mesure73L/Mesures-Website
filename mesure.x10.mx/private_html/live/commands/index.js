function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

let titleList = ["Playing on Skullbound SMP", "Competing in a MMC Fireball Fight Tournament", "Minecraft Manhunt w/ Viewers", "Playing on my Hardcore world", "Minecraft Parkour Event", "Trying to get my first Hoplite win", "Chill Duels with Viewers", "Playing on a parkour server", "Chatting with Viewers"]
let currentTitle = -1;
function changeTitleCommand() {
    let nextTitle = currentTitle + 1;
    if (nextTitle > titleList.length - 1) { nextTitle = 0; }
    document.getElementById("mod.title").innerText = `!title ${titleList[nextTitle]}`;
    setTimeout("changeTitleCommand()", randomInt(2500, 5000));
    currentTitle = nextTitle;
}
changeTitleCommand();

let msgList = ["Follow me to get closer to my goal of 100 followers!", "Play with me - join na.minemen.club and run /duel Mesure73L", "Join my Discord! --> !discord"]
let currentMsg = -1;
function changeMsgCommand() {
    let nextMsg = currentMsg + 1;
    if (nextMsg > msgList.length - 1) { nextMsg = 0; }
    document.getElementById("mod.msg").innerText = `!msg ${msgList[nextMsg]}`;
    setTimeout("changeMsgCommand()", randomInt(2500, 5000));
    currentMsg = nextMsg;
}
changeMsgCommand();