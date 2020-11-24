const syllablize = require("syllablize");

function buttify(original, rate) {
    const originWords = message.cleanContent.split(' ');
    let syllables = originWords.map(syllablize);
    buttified = syllables.map(word => word.join("").split(""));
    for (let i = 0; i < original.length && i < buttified.length; i++) {
        for (let j = 0; j < original[i].length && j < buttified[i].length; j++) {
            if (original[i].charCodeAt(j) >= 65 && original[i].charCodeAt(j) <= 90) {
                buttified[i][j] = buttified[i][j].toUpperCase();
            }
        }
    }
}

function insertButt(originWords, rate) {
    const originSyl = originWords.map(syllablize);
    let buttSyl;
    do {
        buttSyl = originSyl.map(word => word.map(syl => {
            if (Math.random() < 1 / rate) {
                switch (syl[syl.length - 1]) {
                    case 's':
                    case 'z':
                        return "butt" + syl[syl.length - 1];
                    default:
                        return "butt";
                }
            }
            return syl;
        }));
    } while (arrEqual(originSyl, buttSyl));
    return buttSyl.map(syl => syl.join(""));
}

function arrEqual(a, b) {
    if (a.length === b.length) {
        return a.every((n, i) => Array.isArray(n) && Array.isArray(b[i]) ? arrEqual(n, b[i]) : n === b[i]);
    }
    else {
        return false;
    }
}

module.exports = buttify;
