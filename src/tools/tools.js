import { tool } from "@langchain/core/tools";
import * as z from "zod"
import fs from "fs/promises"
import path from "path";

export const upsertTool = tool(
    async function ({ files }) {

        await Promise.all(files.map(async (file) => {
            return await fs.writeFile(file.path, file.content)
        }))

        return `Files created successfully `
    },
    {
        name: "upsertTool",
        description: "This tool is used to create or update a file in the system. It takes an array of files as input, where each file is represented as an object with properties such as name, content, and path. The tool will create a new file if it does not exist, or update the existing file if it does. The tool returns a success message upon completion.",
        schema: z.object({
            files: z.array(z.object({
                path: z.string(),
                content: z.string(),
            }))
        })
    }

)

// export const listFiles = tool(
//     async function ({ folder }) {

//         const newFolder = folder.replaceAll("\\","/");

//         const result = [];

//         async function traverse(folderName) {
//             const entries = await fs.readdir(folderName, { withFileTypes: true });

//             for (const entry of entries) {
//                 const fullPath = path.join(folderName, entry.name);

//                 if (entry.isDirectory()) {
//                     if (entry.name == "node_modules") continue
//                     await traverse(fullPath)

//                 } else {
//                     result.push(fullPath)
//                 }
//             }

//         }

//         await traverse(folder);
//         return JSON.stringify(result);
//     },
//     {
//         name: "listFiles",
//         description: "get all the files in current directory and ignore node_modules folder",
//         schema: z.object({
//             folder: z.string()
//         })

//     }
// )

export const listFiles = tool(
    async function ({ folder }) {
        const result = [];
        const newFolder = folder.replaceAll("\\", "/");

        const traverse = async (folderName) => {
            try {
                const entries = await fs.readdir(folderName, { withFileTypes: true });

                for (const entry of entries) {
                    const fullPath = path.join(folderName, entry.name).replaceAll("\\", "/");

                    if (entry.isDirectory()) {
                        if (entry.name === "node_modules") continue;
                        await traverse(fullPath);
                    } else {
                        result.push(fullPath);
                    }
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error("Error reading directory:", error);
                }
            }
        };

        await traverse(newFolder);

        // HAMESHA sirf JSON string ya plain string return karein!
        return JSON.stringify(result);
    },
    {
        name: "listFiles",
        description: "get all the files in current directory and ignore node_modules folder",
        schema: z.object({
            folder: z.string().describe("The absolute path of the folder to traverse")
        })
    }
);