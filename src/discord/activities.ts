import { ActivitiesOptions, ActivityType } from "discord.js";

const activities: Array<ActivitiesOptions> = [
    {
        type: ActivityType.Playing,
        name: "games of love and deceit"
    },
    {
        type: ActivityType.Listening,
        name: "beans, the musical fruit"
    },
    {
        type: ActivityType.Playing,
        name: "hard to get"
    },
    {
        // @ts-expect-error
        type: ActivityType.Custom,
        name: "On the streets fighting for the Bowel Movement"
    },
    {
        // @ts-expect-error
        type: ActivityType.Custom,
        name: "Tossing a salad"
    },
    {
        // @ts-expect-error
        type: ActivityType.Custom,
        name: "Eating a peach"
    }
];
export default activities;
