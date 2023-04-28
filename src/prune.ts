import { Op } from "sequelize";
import { ResponseCooldown } from "./models/index.js";
import { DISCORD_RESPONSE_COOLDOWN } from "./constants.js";

export async function pruneCooldowns(): Promise<void> {
    await ResponseCooldown.destroy({
        where: {
            updatedAt: { [Op.lt]: Date.now() - (DISCORD_RESPONSE_COOLDOWN * 2) }
        }
    });
}
