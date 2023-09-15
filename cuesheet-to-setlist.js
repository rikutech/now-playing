const { readFileSync, writeFileSync } = require("fs");

const cuesheet = readFileSync("./cuesheet.cue", "utf-8");
const titles =  [...cuesheet.matchAll(/TITLE "(.*)"/g)].map((matched) => matched[1]).slice(1);
const artists =  [...cuesheet.matchAll(/PERFORMER "(.*)"/g)].map((matched) => matched[1]).slice(1);
if (titles.length !== artists.length) {
  throw new Error("Titles and artists length mismatch");
}

writeFileSync('./.setlist-tmp', JSON.stringify(titles.map((title, index) => ({ title, artist: artists[index], imasBrand: "" }))));

console.log("Done");