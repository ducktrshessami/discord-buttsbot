const syllablize = require("syllablize");

function buttify(original, rate) {
    const originWords = original.split(' ');
    let buttWords = insertButt(originWords, rate);
    return handleCaps(originWords, buttWords);
}

function handleCaps(originWords, buttWords) {
    for (let i = 0; i < originWords.length && i < buttWords.length; i++) {
        let buttChars = buttWords[i].split("");
        for (let j = 0; j < originWords[i].length && j < buttChars.length; j++) {
            if (originWords[i].charCodeAt(j) >= 65 && originWords[i].charCodeAt(j) <= 90) {
                buttChars[j] = buttChars[j].toUpperCase();
            }
        }
        buttWords[i] = buttChars.join("");
    }
    return buttWords;
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
