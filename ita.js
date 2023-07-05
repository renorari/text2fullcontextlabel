/* processing ita corpus */

const fs = require("node:fs");
const path = require("node:path");

fs.readFileSync(path.join(__dirname, "ita.txt"), "utf8").trim().split("\n").forEach((line, index, array) => {
    fs.appendFileSync(path.join(__dirname, "sentences.txt"), `${line.split(",")[0]}${index == (array.length -1) ? "": "\n"}`, "utf8");
    console.log(`${Math.round((index + 1) / array.length * 100)}%`);
});