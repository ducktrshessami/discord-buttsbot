import { Message } from "discord.js";
import { syllablize } from "fast-syllablize";
import { IgnoreUser } from "../models/index.js";
import config from "../config.js";

const NonWordPattern = /(https?:\/\/(?:www\.)?[-A-Z0-9@:%._\+~#=]{1,256}(?:\.[A-Z0-9()]{1,6})?\b(?:[-A-Z0-9()@:%_\+.~#?&\/=]*)|<?(?:a?:?\w{2,32}:|#|@[!&]?)\d{17,19}>?|[^A-Z]+)/ig;
const WordPattern = /^[A-Z]+$/i;
const CapsPattern = /^[A-Z]$/;
const AllCapsPattern = /^[A-Z]{2,}$/;
const PluralPattern = /[SZ]$/i;

function chance(n: number): boolean {
    return Math.random() < (1 / n);
}

function buttifyWord(
    original: string,
    word: string,
    rate: number
): string {
    const allCaps = AllCapsPattern.test(original);
    if (PluralPattern.test(original[original.length - 1])) {
        word += original[original.length - 1].toLowerCase();
    }
    return syllablize(original)
        .map(syllable => {
            if (chance(rate)) {
                if (allCaps) {
                    return word.toUpperCase();
                }
                else {
                    let buttified = "";
                    for (let i = 0; i < word.length; i++) {
                        buttified += CapsPattern.test(syllable[i]) ? word[i].toUpperCase() : word[i];
                    }
                    return buttified;
                }
            }
            else {
                return syllable;
            }
        })
        .join("");
}

export function buttify(
    content: string,
    word: string = config.default.word,
    rate: number = config.default.rate
): string {
    return content
        .split(NonWordPattern)
        .map(chars =>
            WordPattern.test(chars) ?
                buttifyWord(
                    chars,
                    word,
                    rate
                ) :
                chars ?? ""
        )
        .join("");
}

export async function buttifiable(message: Message<true>, frequency: number = config.default.frequency): Promise<boolean> {
    const userModel = await IgnoreUser.findByPk(message.author.id);
    return !message.author.bot &&
        !!message.content &&
        !userModel &&
        chance(frequency);
}

export function verifyButtified(
    original: string,
    buttified: string,
    word: string = config.default.word
): boolean {
    if (buttified.length > 2000) {
        return false;
    }
    const buttifiedLower = buttified.toLowerCase();
    return original.toLowerCase() !== buttifiedLower && buttifiedLower.replaceAll(NonWordPattern, "") === word.toLowerCase();
}
