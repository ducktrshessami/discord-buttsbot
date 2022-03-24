const syllablize = require("syllablize");

// Main
function buttify(original, buttWord, rate) {
    const originWords = formatWords(original);
    if (originWords.some(item => item.type === 1)) {
        let buttWords;
        for (let i = 0; i < rate * 1000 && (!buttWords || compareWords(originWords, buttWords)); i++) { // Set limit to avoid user setting based infinite loop
            buttWords = originWords.map(wordObj => wordObj.type === 1 ? chanceButt(wordObj, buttWord, rate) : copyObj(wordObj));
        }
        return handleCaps(originWords, buttWords)
            .map(item => item.chars)
            .join("");
    }
    else {
        return original;
    }
}

// Roughly capitalize letters like the original
function handleCaps(originWords, buttWords) {
    for (let i = 0; i < originWords.length && i < buttWords.length; i++) {
        if (originWords[i].type === 1) {
            if (originWords[i].chars === originWords[i].chars.toUpperCase()) {
                buttWords[i].chars = buttWords[i].chars.toUpperCase();
            }
            else {
                let buttChars = buttWords[i].chars.split("");
                for (let j = 0; j < originWords[i].chars.length && j < buttChars.length; j++) {
                    if (originWords[i].chars.charCodeAt(j) >= 65 && originWords[i].chars.charCodeAt(j) <= 90) {
                        buttChars[j] = buttChars[j].toUpperCase();
                    }
                }
                buttWords[i].chars = buttChars.join("");
            }
        }
    }
    return buttWords;
}

// Possibly replace syllables in a word with "butt"
function chanceButt(wordObj, buttWord, rate) {
    const originSyl = syllablize(wordObj.chars);
    wordObj = copyObj(wordObj);
    let buttSyl = originSyl.map(syl => {
        if (Math.random() < 1 / rate) {
            switch (syl[syl.length - 1]) {
                case 's':
                case 'z':
                    return buttWord + syl[syl.length - 1];
                default:
                    return buttWord;
            }
        }
        return syl;
    });
    wordObj.chars = buttSyl.join("");
    return wordObj;
}

/*
Format a string into words, special, and miscellaneous characters

type will be a Number:
1 - word
2 - misc
*/
function formatWords(str = "") {
    let result = [];
    str
        .match(/(https?:\/\/(www\.)?[-\w@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-\w()@:%\+.~#?&//=]*))|(<a?:\w{2,32}:\d{18}>)|([^a-zA-Z])|([a-zA-Z]+)/g)
        .forEach(chunk => {
            if (/^[a-z]+$/i.test(chunk)) {
                result.push({
                    type: 1,
                    chars: chunk
                });
            }
            else if (!result.length || result[result.length - 1].type === 1) {
                result.push({
                    type: 2,
                    chars: chunk
                });
            }
            else {
                result[result.length - 1].chars += chunk;
            }
        });
    return result;
}

// Deep copy object
function copyObj(obj) {
    let foo = {};
    for (let key in obj) {
        foo[key] = obj[key];
    }
    return foo;
}

// Words to strings
function unformatWords(words) {
    return words
        .map(item => item.chars)
        .join("")
        .toLowerCase();
}

// Compare word objects
function compareWords(a, b) {
    return unformatWords(a) === unformatWords(b);
}

module.exports = buttify;
