
import * as assert from "assert";
import { promises as fsPromises } from "fs";
import { importBackup } from "./widgets/settings.mjs";
import { getConfig as getServerConfig } from "./widgets/server.mjs";
import { getConfig as getDeviceConfig } from "./widgets/devices.mjs";


const { readFile } = fsPromises;




export default async (browser) => {
    try {
        const page = await browser.newPage();
        await page.goto("http://localhost:8080/");

        let backups = ["./backups/1.4.5.json"];

        for (const backup of backups) {
            await importBackup(page, backup);

            try {
                const json = JSON.parse(await readFile(backup));
                const serverConfig = await getServerConfig(page);

                const deviceConfig1 = await getDeviceConfig(await page.$(".device[data-name='test-1']"));
                const deviceConfig2 = await getDeviceConfig(await page.$(".device[data-name='test-2']"));

                console.log(serverConfig);
                console.log(deviceConfig1);
                console.log(deviceConfig2);

            } catch (error) {
                console.error(error);

            }



        }



    } catch (error) {
        console.error(error);
        throw error;
    }


};
