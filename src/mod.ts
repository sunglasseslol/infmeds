import { DependencyContainer } from "tsyringe";

// Servers
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

// Mod load types
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";

// Generic
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { BaseClasses } from "@spt-aki/models/enums/BaseClasses";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";

// Config
import * as config from "../config/config.json";

class Mod implements IPostDBLoadMod
{
    public postDBLoad(container: DependencyContainer): void 
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = db.getTables();
        const items = tables.templates.items;
        const locales = tables.locales.global;

        const random = Math.floor(Math.random() * 1000 + 1)
        // const random = 1000;
        if (random == 1000)
            logger.logWithColor("[ InfMeds ] its a 1 in 1000 chance to get this message and since you recieved it that means your special", LogTextColor.MAGENTA);

        let loopedOverStims = 0;
        let loopedOverMedkits = 0;
        let loopedOverMedical = 0;

        for (const item in items) {
            const itemProps = items[item]._props;
            const itemId = items[item]._id;
            
            // STIMS CONFIG : SJ6s, Propitals etc
            if (config.changeStims) {
                if (items[item]._parent == BaseClasses.STIMULATOR) {
                    if (config.blacklisted_stims.includes(items[item]._id)) {
                        logger.logWithColor(`[ InfMeds - Stims ] ${locales["en"][`${itemId} ShortName`]} is blacklisted and will not get infinite uses`, LogTextColor.GRAY);
                        continue;
                    }

                    if (config.infStims)
                        itemProps.MaxHpResource = 999;
                    else if (!config.infStims)
                        itemProps.MaxHpResource = config.stimUses;
                    if (config.logItemsWithModifiedUses)
                        logger.logWithColor(`[ InfMeds - Stims ] ${locales["en"][`${itemId} ShortName`]} now has 999 uses`, LogTextColor.GRAY)
                    loopedOverStims++;
                }
            }
            
            // MEDKIT CONFIG : Like Salewas etc
            if (config.changeMedkits) {
                if (items[item]._parent == BaseClasses.MEDKIT) {
                    if (config.blacklisted_medkits.includes(items[item]._id)) {
                        logger.logWithColor(`[ InfMeds - Medkits ] ${locales["en"][`${itemId} ShortName`]} is blacklisted and will not get infinite uses`, LogTextColor.RED);
                        continue;
                    }

                    if (config.infMedkits)
                        itemProps.MaxHpResource = 9999;
                    else if (!config.infMedkits)
                        itemProps.MaxHpResource = config.medkitHp;
                    if (config.logItemsWithModifiedUses)
                        logger.logWithColor(`[ InfMeds - Medkits ] ${locales["en"][`${itemId} ShortName`]} now has 9999 hp`, LogTextColor.GRAY)
                    loopedOverMedkits++;
                }
            }

            // MEDs CONFIG : CMSs, Bandages etc
            if (config.changeMedical) {
                if (items[item]._parent == BaseClasses.MEDICAL) {
                    if (config.blacklisted_medkits.includes(items[item]._id)) {
                        logger.logWithColor(`[ InfMeds - Medical ] ${locales["en"][`${itemId} ShortName`]} is blacklisted and will not get infinite uses`, LogTextColor.RED);
                        continue;
                    }

                    if (config.infMedical)
                        itemProps.MaxHpResource = 999;
                    else if (!config.infMedical)
                        itemProps.MaxHpResource = config.medicalUses;
                    if (config.logItemsWithModifiedUses)
                        logger.logWithColor(`[ InfMeds - Medical ] ${locales["en"][`${itemId} ShortName`]} now has infinite uses`, LogTextColor.GRAY)
                    loopedOverMedical++;
                }
            }
        }
        logger.logWithColor(`[ InfMeds ] Looped over ${loopedOverStims} stims and made them have infinite uses`, LogTextColor.CYAN);
        logger.logWithColor(`[ InfMeds ] Looped over ${loopedOverMedkits} medkits and made them have infinite uses`, LogTextColor.CYAN);
        logger.logWithColor(`[ InfMeds ] Looped over ${loopedOverMedical} medical items and made them have infinite uses`, LogTextColor.CYAN);
    }
}

module.exports = { mod: new Mod() }