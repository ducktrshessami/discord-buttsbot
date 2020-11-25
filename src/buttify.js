const syllablize = require("syllablize");

// Main
function buttify(original, buttWord = "butt", rate) {
    const originWords = formatWords(original);
    if (originWords.some(item => item.type == "word")) {
        let buttWords;
        do {
            buttWords = originWords.map(wordObj => wordObj.type == "word" ? chanceButt(wordObj, buttWord, rate) : copyObj(wordObj));
        } while (compareWords(originWords, buttWords));
        return handleCaps(originWords, buttWords).map(item => item.chars).join("");
    }
    else {
        return original;
    }
}

// Roughly capitalize letters like the original
function handleCaps(originWords, buttWords) {
    for (let i = 0; i < originWords.length && i < buttWords.length; i++) {
        if (originWords[i].type == "word") {
            let buttChars = buttWords[i].chars.split("");
            for (let j = 0; j < originWords[i].chars.length && j < buttChars.length; j++) {
                if (originWords[i].chars.charCodeAt(j) >= 65 && originWords[i].chars.charCodeAt(j) <= 90) {
                    buttChars[j] = buttChars[j].toUpperCase();
                }
            }
            buttWords[i].chars = buttChars.join("");
        }
    }
    return buttWords;
}

// Possibly replace syllables in a word with "butt"
function chanceButt(wordObj, buttWord, rate) {
    const originSyl = syllablize(wordObj.chars);
    let buttSyl;
    wordObj = copyObj(wordObj);
    buttSyl = originSyl.map(syl => {
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

// Format a string into whitespace and words
function formatWords(str) {
    let result = [], stack = { chars: "" };
    for (let i = 0; i < str.length; i++) {
        if (`!"#$%&'()*+,-./:;<=>?@[]^_\`{|}~ \n\t`.includes(str[i])) {
            if (!stack.type) {
                stack.type = "misc";
            }
            else if (stack.type != "misc") {
                result.push(stack);
                stack = {
                    type: "misc",
                    chars: ""
                };
            }
        }
        else {
            if (!stack.type) {
                stack.type = "word";
            }
            else if (stack.type != "word") {
                result.push(stack);
                stack = {
                    type: "word",
                    chars: ""
                };
            }
        }
        stack.chars += str[i];
    }
    if (stack.chars.length) {
        result.push(stack);
    }
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

// Compare word objects
function compareWords(a, b) {
    return a.map(item => item.chars).join("").toLowerCase() === b.map(item => item.chars).join("").toLowerCase();
}

module.exports = buttify;
