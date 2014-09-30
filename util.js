var execSync = require("exec-sync");
var fs = require('fs');

function loadJson(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

// parse { extractor, id } out of key from dbjson
function getVideoSource(key) {
  var re = /\('(.+)',\s*'(.+)'\)/;
  var match = key.match(re);
  // console.log(match[1], match[2]);
  return (match)? {
    extractor: match[1],
    video_id: match[2]
  } : null;
}

function sourceToUrl(source) {
  // console.log(source);
  if (source.extractor == 'youtube') {
    return 'https://www.youtube.com/watch?v='+source.video_id;
  }
  else if (source.extractor == 'vimeo') {
    return 'https://www.vimeo.com/'+source.video_id;
  }
  else if (source.extractor == 'BlipTV') {
    return 'https://blip.tv/file/'+source.video_id;
  }
  else {
    return '';
  }
}

function downloadInfoJson(url) {
  // console.log('downloading info.json: ' + url);
  try {
    execSync("youtube-dl.py --skip-download --write-info-json -o '%(autonumber)s-[%(title)s]-[%(id)s].%(ext)s' " + url);
    return true;
  }
  catch (e) {
    console.error(e);
    return false;
  }
}

function writeJson(json, outfile) {
  if (Object.keys(json).length !== 0) {
    fs.writeFileSync(outfile, JSON.stringify(json, null, 2));
    return true;
  }
  return false;
}

module.exports = {
  loadJson: loadJson,
  getVideoSource: getVideoSource,
  sourceToUrl: sourceToUrl,
  downloadInfoJson: downloadInfoJson,
  writeJson: writeJson
};
