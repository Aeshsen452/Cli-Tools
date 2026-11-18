import { ChatGroq } from "@langchain/groq"
import { getFileData } from "../utils/files.utils.js"
import { upsertTool, listFiles } from "../tools/tools.js";
import * as fileTools from "../tools/tools.js"


const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: (await getFileData()).apiKey
})

const agentModel = model.bindTools([upsertTool, listFiles])


export async function LLmFn(state) {


    const stream = await agentModel.stream(state.messages);


    let aiResponse = null;

    for await (const chunk of stream) {
        process.stdout.write(chunk.content)

        if (!aiResponse) {
            aiResponse = chunk
        } else {
            aiResponse = aiResponse.concat(chunk)
        }

    }

    console.log("")


    return {
        messages: [
            ...state.messages,
            aiResponse
        ]
    };

}



export async function ToolNode(state) {

    const messages = state.messages;
    const lastMessages = messages[messages.length - 1];
    const tool_calls = lastMessages.tool_calls;

    const result = await Promise.all(tool_calls.map((tools) => {
        return fileTools[tools.name].invoke(tools);
    }))

    return {
        messages: [
            ...messages,
            ...result
        ]
    }

}