const path = require("path");

function parseFiles(files){
    const parsedFiles = [];

    files.forEach(file=>{
        parsedFiles.push(path.parse(file))
    })

    return parsedFiles
}

module.exports = parseFiles;