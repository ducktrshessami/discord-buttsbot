import { Message } from "discord.js";
import { syllablize } from "fast-syllablize";
import config from "../config.js";

const ExpectedProbability = 0.95;
const NonWordPattern = /(https?:\/\/(?:www\.)?[-A-Z0-9@:%._\+~#=]{1,256}(?:\.[A-Z0-9()]{1,6})?\b(?:[-A-Z0-9()@:%_\+.~#?&\/=]*)|<?(?:a?:?\w{2,32}:|#|@[!&]?)\d{17,19}>?|[^A-Z]+)/ig;
const WordPattern = /^[A-Z]+$/i;
const CapsPattern = /^[A-Z]$/;
const AllCapsPattern = /^[A-Z]{2,}$/;
const PluralPattern = /[SZ]$/i;

class ContentItem<Word extends boolean = boolean> {
    private readonly word: Word;
    private readonly allCaps: Word extends true ? boolean : false;
    private readonly pluralChar: string | null;
    private readonly _syllables: Word extends true ? Array<string> : null;
    private _current: Word extends true ? string : null;
    private _buttified: boolean;

    constructor(private readonly content: ButtifiedContent, public readonly chars: string) {
        this.word = <typeof this.word>WordPattern.test(chars);
        this.allCaps = <typeof this.allCaps>(this.word ? AllCapsPattern.test(chars) : false);
        this.pluralChar = this.word &&
            !this.content.pluralWord &&
            PluralPattern.test(chars[chars.length - 1]) ?
            chars[chars.length - 1] :
            null;
        this._syllables = <typeof this._syllables>(this.word ? syllablize(chars) : null);
        this._current = <typeof this._current>(this.word ? chars : null);
        this._buttified = false;
        this.buttify();
    }

    get syllables(): number {
        return this._syllables?.length ?? 0;
    }

    get buttified(): boolean {
        return this._buttified;
    }

    get length(): number {
        return this._current?.length ?? this.chars.length;
    }

    isWord(): this is ContentItem<true> {
        return this.word;
    }

    buttify(): string {
        if (!this.isWord()) {
            return this.chars;
        }
        this._buttified = false;
        this._current = <typeof this._current>this._syllables.reduce(
            (
                buttified,
                syllable,
                i,
                syllables
            ) => {
                if (chance(this.content.rate)) {
                    let word = this.content.word;
                    this._buttified = true;
                    if (this.pluralChar && i === syllables.length - 1) {
                        word += this.pluralChar;
                    }
                    if (this.allCaps) {
                        buttified += word.toUpperCase();
                    }
                    else for (let j = 0; j < word.length; j++) {
                        buttified += CapsPattern.test(syllable[j]) ? word[j].toUpperCase() : word[j];
                    }
                }
                else {
                    buttified += syllable;
                }
                return buttified;
            },
            ""
        );
        return this._current;
    }

    toString(): string {
        return this._current ?? this.chars;
    }
}

class ButtifiedContent {
    readonly pluralWord: boolean;
    private readonly items: Array<ContentItem>;

    constructor(
        readonly original: string,
        readonly word: string,
        readonly rate: number
    ) {
        this.pluralWord = PluralPattern.test(word[word.length - 1]);
        this.items = original
            .split(NonWordPattern)
            .reduce((items, item) => {
                if (item) {
                    items.push(new ContentItem(this, item));
                }
                return items;
            }, new Array<ContentItem>());
    }

    get syllables(): number {
        return this.items.reduce((syllables, item) => syllables + item.syllables, 0);
    }

    get buttified(): boolean {
        return this.items.some(item => item.buttified);
    }

    get length(): number {
        return this.items.reduce((length, item) => length + item.length, 0);
    }

    get valid(): boolean {
        return this.buttified && this.length <= 2000;
    }

    buttify(): string {
        return this.items.reduce((buttified, item) => buttified + item.buttify(), "");
    }

    toString(): string {
        return this.items.join("");
    }
}

function chance(n: number): boolean {
    return Math.random() < (1 / n);
}

function attempts(rate: number, syllables: number): number {
    return Math.min(config.limit.attempts, Math.ceil(Math.log(1 - ExpectedProbability) / (syllables * Math.log((rate - 1) / rate))));
}

export function buttify(
    content: string,
    word: string = config.default.word,
    rate: number = config.default.rate
): string | null {
    const buttifiedContent = new ButtifiedContent(
        content,
        word,
        rate
    );
    if (buttifiedContent.syllables < 2) {
        return null;
    }
    const maxAttempts = rate > 1 ? attempts(rate, buttifiedContent.syllables) : 1;
    for (let i = 1; i < maxAttempts && !buttifiedContent.valid; i++) {
        buttifiedContent.buttify();
    }
    return buttifiedContent.valid ? buttifiedContent.toString() : null;
}

export function buttifiable(message: Message<true>, frequency: number = config.default.frequency): boolean {
    return !message.author.bot &&
        !!message.content &&
        chance(frequency);
}
