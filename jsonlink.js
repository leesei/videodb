#!/usr/bin/env node

var fs = require("fs");
var chalk = require("nomnom/node_modules/chalk");
var argv = require("nomnom")
  .script("jsonlink")
  .option("file", {
    position: 0,
    help: "JSON file(s) to parse",
    list: true,
    required: true,
  })
  .option("markdown", {
    abbr: "m",
    flag: true,
    help: "Print url in Markdown format",
  })
  .help(
    chalk.bold("Author: ") +
      chalk.underline("leesei@gmail.com") +
      "       " +
      chalk.bold("Licence: ") +
      "MIT\n",
  )
  .parse();

// console.log(argv);

var i;
for (i = 0; i < argv.file.length; i++) {
  var file = argv.file[i];
  try {
    var json = JSON.parse(fs.readFileSync(file));
    if (!argv.silent) {
      if (file.match(/.info.json$/)) {
        // yt-dlp info json
        if (argv.markdown) {
          console.log("[%s](%s]", json.title, json.webpage_url);
        } else {
          console.log(json.webpage_url);
        }
      } else if (file.match(/.db.json$/)) {
        // my dbjson, probably need looping through elements
        json.forEach(function (entry) {
          if (argv.markdown) {
            console.log("[%s](%s]", entry.title, entry.url);
          } else {
            console.log(entry.url);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error parsing "%s"', file);
  }
}
