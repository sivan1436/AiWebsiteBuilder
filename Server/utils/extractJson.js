export default async function extractJson(text) {
if(!text){
   return
}   
 const cleaned = text.replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim(); 
const firstCurlyIndex = cleaned.indexOf("{");
const lastCurlyIndex = cleaned.lastIndexOf("}");
if(firstCurlyIndex === -1 || lastCurlyIndex === -1 || firstCurlyIndex >= lastCurlyIndex) {
    return null; // No valid JSON found
}
const jsonString = cleaned.slice(firstCurlyIndex, lastCurlyIndex + 1);
let normalizedJson = "";
let inString = false;

for (let index = 0; index < jsonString.length; index++) {
    const character = jsonString[index];

    if (character === '"' && jsonString[index - 1] !== "\\") {
        inString = !inString;
        normalizedJson += character;
        continue;
    }

    if (!inString) {
        normalizedJson += character;
        continue;
    }

    if (character === "\\") {
        const nextCharacter = jsonString[index + 1];
        if (!["\"", "\\", "/", "b", "f", "n", "r", "t", "u"].includes(nextCharacter)) {
            normalizedJson += "\\\\";
        } else {
            normalizedJson += character;
        }
        continue;
    }

    if (character === "\n") {
        normalizedJson += "\\n";
    } else if (character === "\r") {
        normalizedJson += "\\r";
    } else if (character === "\t") {
        normalizedJson += "\\t";
    } else {
        normalizedJson += character;
    }
}

try {
    return JSON.parse(normalizedJson);
} catch {
    return null;
}
}