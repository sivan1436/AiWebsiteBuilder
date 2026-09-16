export default async function extractJson(text) {
if(!text){
   return
}   
 const cleaned = text.replace(/```json/gi,"")
    .replace(/```/g,"")
    .trim(); 
const firstCurlyIndex = cleaned.indexOf("{");
const lastCurlyIndex = cleaned.lastIndexOf("}");
if(firstCurlyIndex === -1 || lastCurlyIndex === -1 || firstCurlyIndex >= lastCurlyIndex) {
    return null; // No valid JSON found
}
const jsonString = cleaned.slice(firstCurlyIndex, lastCurlyIndex + 1);
return JSON.parse(jsonString);
}