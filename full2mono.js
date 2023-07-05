/* full context label to mono label */

const fs = require("node:fs");
const path = require("node:path");

fs.readdirSync("./full").forEach((file) => {
    fs.readFile(path.join("./full", file), "utf8", (err, data) => {
        if (err) throw err;
        const lines = data.split("\n");
        let mono = "";
        lines.forEach((line) => {
            if (line.length > 0) {
                const phone = line.split(" ");
                mono += `${phone[0]} ${phone[1]} ${phone[2].match(/-(.*?)\+/)[1]}\n`
            }
        });
        fs.writeFileSync(path.join("./mono", file), mono.trim());
    });
});