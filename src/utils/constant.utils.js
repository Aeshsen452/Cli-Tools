import os from "os";
import path from "path";


export const HomeDir = os.homedir();
export const KeyPath = path.join(HomeDir, "beta");
