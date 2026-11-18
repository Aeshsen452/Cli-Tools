import { StateGraph, START, END } from "@langchain/langgraph";
import { LLmFn, ToolNode } from "./node.js";
import * as z from "zod";
import { SystemMessage } from "@langchain/core/messages";

const StructuredFormate = z.object({
    messages: z.array(z.any())
})
const graph = new StateGraph(StructuredFormate)
    .addNode("LLMNode", LLmFn)
    .addNode("ToolNode", ToolNode)
    .addEdge(START, "LLMNode")
    .addEdge("ToolNode", "LLMNode")
    .addConditionalEdges("LLMNode", (state) => {
        const messages = state.messages;
        const lastMessage = messages[messages.length - 1];
        const tool_calls = lastMessage.tool_calls;

        if (tool_calls.length > 0) return "ToolNode"

        return END
    })
    .compile()


let messages = [
    new SystemMessage(`You have to answered all reponse in hinglish and try to complete in 100 words
              this is my absolute path ~ ${process.cwd()}
        `)
];

const initGraph = async (userInput) => {

    const userMessages = {
        role: 'user',
        content: userInput
    }

    messages.push(userMessages);

    const data = await graph.invoke({ messages });


    messages = data.messages

    return data
}


export default initGraph;