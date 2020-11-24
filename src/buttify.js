const syllablize = require("syllablize");

function buttify(original, rate) {
    const originWords = formatWords(original);
    let buttWords;
    do {
        buttWords = originWords.map(wordObj => wordObj.type == "word" ? chanceButt(wordObj, rate) : copyObj(wordObj));
    } while (compareWords(originWords, buttWords));
    return handleCaps(originWords, buttWords).map(item => item.chars).join("");
}

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

function chanceButt(wordObj, rate) {
    const originSyl = syllablize(wordObj.chars);
    let buttSyl;
    wordObj = copyObj(wordObj);
    buttSyl = originSyl.map(syl => {
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
    });
    wordObj.chars = buttSyl.join("");
    return wordObj;
}

function formatWords(str) {
    let result = [], stack = { chars: "" };
    for (let i = 0; i < str.length; i++) {
        if (" \n\t".includes(str[i])) {
            if (!stack.type) {
                stack.type = "blank";
            }
            else if (stack.type != "blank") {
                result.push(stack);
                stack = {
                    type: "blank",
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

function copyObj(obj) {
    let foo = {};
    for (let key in obj) {
        foo[key] = obj[key];
    }
    return foo;
}

function compareWords(a, b) {
    return a.map(item => item.chars).join("").toLowerCase() === b.map(item => item.chars).join("").toLowerCase();
}

module.exports = buttify;
