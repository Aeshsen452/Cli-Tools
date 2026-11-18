import { getFileData, createFile } from "./utils/files.utils.js";
import readLine from "./utils/readline.utils.js";
import axios from "axios";


const MainFn = async () => {
    const systemfile = await getFileData();

    if (!systemfile.apiKey) {
        console.log("We couldn't Find any Api key to process further")
        while (true) {
            const apiKey = await readLine.question("Enter you Groq Api Key ");
            await createFile(apiKey);

            try {
                const res = await axios.get("https://api.groq.com/openai/v1/models", {
                    headers: {
                        Authorization: `Bearer ${apiKey}`
                    }
                })

                break;
            } catch (error) {
                console.log("Your Api key invalid please enter a valid api key");
            }


        }

    }


    const { default: initGraph } = await import("./graph/graph.js");

    while (true) {
        const userInput = await readLine.question("[user ] :");

        if (userInput.trim().toLowerCase() == "exit") {
            console.log("thanks for using us !!");
            readLine.close();
            break;
        }

        const aiResponse = await initGraph(userInput);
    }

}


export default MainFn

