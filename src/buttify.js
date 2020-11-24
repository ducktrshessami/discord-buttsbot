const syllablize = require("syllablize");

function buttify(original, rate) {
    const original = message.cleanContent.split(' ');
    let butts = Math.ceil(Math.random() * config.servers[message.guild.id].max);
    let syllables = original.map(syllablize);
    let buttified;
    for (let i = 0; i < butts; i++) {
        let x, y, check;
        do {
            check = syllables.every(word => word.every(syl => syl.includes("butt")));
            x = Math.floor(Math.random() * syllables.length);
            y = Math.floor(Math.random() * syllables[x].length);
        } while (!check && syllables[x][y].includes("butt"));
        if (!check) {
            syllables[x][y] = syllables[x][y][syllables[x][y].length - 1] == "s" ? "butts" : "butt";
        }
    }
    buttified = syllables.map(word => word.join("").split(""));
    for (let i = 0; i < original.length && i < buttified.length; i++) {
        for (let j = 0; j < original[i].length && j < buttified[i].length; j++) {
            if (original[i].charCodeAt(j) >= 65 && original[i].charCodeAt(j) <= 90) {
                buttified[i][j] = buttified[i][j].toUpperCase();
            }
        }
    }
}

module.exports = buttify;
