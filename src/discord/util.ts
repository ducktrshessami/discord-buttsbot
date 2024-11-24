import { APIApplicationCommandOptionChoice, PermissionResolvable, PermissionsBitField } from "discord.js";
import { distance } from "fastest-levenshtein";

export const WhitespacePattern = /\s/;

export function resolvePermissionString(...permissions: PermissionResolvable[]): string {
    return PermissionsBitField
        .resolve(permissions)
        .toString();
}

function standardizeString(str: string): string {
    return str
        .replaceAll(/\s+/g, "_")
        .toLowerCase();
}

function parseChoiceData<T extends string | number>(query: string, choiceData: APIApplicationCommandOptionChoice<T>): QueriedChoiceData<T> {
    const standardized = standardizeString(choiceData.name);
    return {
        ...choiceData,
        startsWith: Number(standardized.startsWith(query)),
        distance: distance(query, choiceData.name)
    };
}

interface Reducible<K, V> {
    reduce<T>(
        fn: (
            accumulator: T,
            value: V,
            key: K,
            reducible: this
        ) => T,
        initialValue?: T
    ): T;
}

type QueriedChoiceData<T extends string | number> = APIApplicationCommandOptionChoice<T> & {
    startsWith: number;
    distance: number;
};

export function parseQuery<K, V, T extends string | number>(
    query: string,
    reducible: Reducible<K, V>,
    fn: (value: V, key: K, reducible: Reducible<K, V>) => APIApplicationCommandOptionChoice<T> | null,
    firstWhenEmptyQuery?: T
): APIApplicationCommandOptionChoice<T>[] {
    let choices: APIApplicationCommandOptionChoice<T>[];
    if (query) {
        const standardizedQuery = standardizeString(query);
        choices = reducible
            .reduce<QueriedChoiceData<T>[]>((accumulator, value, key, reducible) => {
                const data = fn(value, key, reducible);
                if (data) {
                    accumulator.push(parseChoiceData(standardizedQuery, data));
                }
                return accumulator;
            }, [])
            .sort((a, b) =>
                a.startsWith === b.startsWith ?
                    a.distance - b.distance :
                    b.startsWith - a.startsWith
            );
    }
    else {
        choices = reducible.reduce<APIApplicationCommandOptionChoice<T>[]>((accumulator, value, key, reducible) => {
            const data = fn(value, key, reducible);
            if (data) {
                if (data.value === firstWhenEmptyQuery) {
                    accumulator.unshift(data);
                }
                else {
                    accumulator.push(data);
                }
            }
            return accumulator;
        }, []);
    }
    return choices.slice(0, 25);
}
