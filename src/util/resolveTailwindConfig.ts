import { cwd } from 'node:process';
import fs from 'fs';
import { checkNewData } from "./editTCOConfig";

function resolveTailwindConfig (path:string = "") {
    let basePath = cwd();
    if(path !== "") {
        basePath = basePath + sanitizePathString(path);
    }

    if(fs.existsSync(basePath + "/tailwind.config.js")) {
        const config = require(basePath + "/tailwind.config.js");
        checkNewData(config);

    } else {
        console.log("Couldn't resolve tailwind config in " + basePath);
    }
}

function sanitizePathString(path:string) {
    path = path.replace(/^(\.\/)/g, "/");
    if(new RegExp(/^(?!\/)/).test(path)) {
        return "/" + path;
    }
    return path;
}

export {
    resolveTailwindConfig,
}
