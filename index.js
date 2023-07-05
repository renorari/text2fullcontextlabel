/* plain text to hts full context label */
const fs = require("node:fs");
const path = require("node:path");
const child_process = require("node:child_process");

const text = fs.readFileSync(path.join(__dirname, "sentences.txt"), "utf8");
const lines = text.split("\n");

// Mac / Linux
let dic = "/var/lib/mecab/dic/open-jtalk/naist-jdic";
switch (process.platform) {
    case "win32":
        dic = "C:\\open_jtalk\\dic";
        break;
    case "darwin":
        dic = "/opt/homebrew/Cellar/open-jtalk/1.11/dic/"
        break;
    case "linux":
        dic = "/var/lib/mecab/dic/open-jtalk/naist-jdic";
        break;
    default:
        dic = "/var/lib/mecab/dic/open-jtalk/naist-jdic";
        break;
}
let model = "/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice";
switch (process.platform) {
    case "win32":
        model = "C:\\open_jtalk\\voice\\nitech_jp_atr503_m001.htsvoice";
        break;
    case "darwin":
        model = "/opt/homebrew/Cellar/open-jtalk/1.11/voice/mei/mei_normal.htsvoice"
        break;
    case "linux":
        model = "/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice";
        break;
    default:
        model = "/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice";
        break;
}

(async () => {
    Promise.all(
        lines.map(async (line, index) => {
            const file = line.split(":")[0];
            const text = line.split(":")[1];
            child_process.exec(`echo "${text}" | open_jtalk -x ${dic} -m ${model} -ot log/${file}.txt`, { encoding: "utf8" }, (error, stdout, stderr) => {
                if (error) {
                    return console.error(`${Math.round((index + 1) / lines.length * 100)} ${line}\nerror: ${error.message}`);
                }
                if (stderr) {
                    return console.error(`${Math.round((index + 1) / lines.length * 100)} ${line}\nstderr: ${stderr}`);
                }
                const log = fs.readFileSync(path.join(__dirname, "log", `${file}.txt`), "utf8");
                const context = (log.match(/\[Output label\][\s\S]+?(?=\n\n|$)/)[0].trim() ?? "").replace(/\[Output label\]/, "").trim();
                fs.writeFileSync(path.join(__dirname, "full", `${file}.lab`), context, "utf8");
                if (context === "") {
                    return console.error(`${Math.round((index + 1) / lines.length * 100)} ${line}\nerror`);
                }
                console.log(`${Math.round((index + 1) / lines.length * 100)} ${line}`);
            });
        })
    );
})();
