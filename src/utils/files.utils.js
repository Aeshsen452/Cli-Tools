import path from "path";
import { KeyPath } from "./constant.utils.js";
import fs from "fs/promises"


export const getFileData = async () => {
    try {
        await fs.access(KeyPath);
    } catch (error) {
        await fs.mkdir(KeyPath, { recursive: true })
    }

    const configFilePath = path.join(KeyPath, "system.json")

    try {
        const data = await fs.readFile(configFilePath);
        return JSON.parse(data)
    } catch (error) {
        await fs.writeFile(configFilePath, JSON.stringify({}));
        return {}

    }


}


export const createFile = async (apiKey) => {
    await getFileData();

    const configFilePath = path.join(KeyPath, "system.json");
    const payLoad = {
        apiKey
    }
    await fs.writeFile(configFilePath, JSON.stringify(payLoad), "utf-8");
}