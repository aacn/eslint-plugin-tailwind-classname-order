import fs from 'fs';
const path = require('path');
const tcoConfig = require('../tcoconfig.json');
const orderConfig = require('../rules/orderConfig.json');

type JSONValue =
    | string
    | number
    | JSONValue[]
    | {[key: string]: JSONValue}

type JSONObject = {
    [k in string]: JSONValue;
};

/*
https://bobbyhadz.com/blog/typescript-write-to-a-file
https://www.samanthaming.com/tidbits/76-converting-object-to-array/
https://www.microverse.org/blog/how-to-loop-through-the-array-of-json-objects-in-javascript
 */

function checkNewData(tailwindConfig: Record<any, any>) {
    //THEME - screens
    compareConfigs("screens", "theme", Object.entries(tailwindConfig.theme.screens));
}

function compareConfigs(cat: string, modifier: string, twEntries: Array<Array<string>>) {
    let tcoconfigEntries: Array<Array<string>>;

    if (modifier != "" && tcoConfig[modifier] != undefined) {
        tcoconfigEntries = JSONtoArray(tcoConfig[modifier][cat]);
    } else if (modifier === "" && tcoConfig[modifier] != undefined) {
        tcoconfigEntries = JSONtoArray(tcoConfig[cat]);
    } else {
        console.log("No category named '" + modifier + "' found in tailwind config.");
        return;
    }


    console.log("ENTRIES", twEntries);
    console.log("CONFIG", tcoconfigEntries)

    if(!doArraysMatch(twEntries, tcoconfigEntries)) {
        console.log("Overwritting orderConfig.json...");
        updateConfig(cat, modifier, arrayToJSON(twEntries));
        updateOrderConfig(cat, modifier, tcoconfigEntries);
    }

}

function updateConfig(cat: string, mod: string, newData: JSONObject) {
    const tcoconfigPath = path.resolve(__dirname, '../tcoconfig.json');
    try {
        const tcoConfigFile = fs.readFileSync(tcoconfigPath, 'utf-8');
        const tcoConfigData = JSON.parse(tcoConfigFile);

        if(mod != "") {
            if(tcoConfigData[mod] != undefined) {
                tcoConfigData[mod][cat] = newData;
            } else {
                return;
            }
        } else {
            tcoConfigData[cat] = newData;
        }
        let json = JSON.stringify(tcoConfigData, null, "\t");
        try {
            fs.writeFileSync(tcoconfigPath, json, 'utf-8');
        } catch(err) {
            console.log(err);
        }
    } catch(err) {
        console.log(err);
    }
}

function updateOrderConfig(cat: string, mod: string, newData: Array<Array<string>>) {
    //get entrypoint for orderConfig.json
    const naming: Array<string> = tcoConfig.orderConfigNaming[cat];
    //if two points are given, it's multiple elems belonging to one category
    if (naming.length > 1) {
        const entryStart = orderConfig.priority.indexOf(naming[0]);
        //end point index und dann splice mit der length zwischen start und end
    }

    console.log();
}

function JSONtoArray(json: any): Array<any> {
    return Object.keys(json).map((key) => [key, json[key]])
}

function arrayToJSON(arr: Array<Array<string>>): JSONObject {
    let json: JSONObject = {};
    arr.forEach(elem => {
       json[elem[0]] = elem[1];
    });
    return json;
}

function doArraysMatch(arr1: Array<Array<string>>, arr2: Array<Array<string>>): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        for(let j = 0; j < 2; j++) {
            if (arr1[i][j] !== arr2[i][j]) {
                return false;
            }
        }
    }
    return true;
}

export {
    checkNewData
}
