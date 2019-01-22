const path = require("path");

function getJavascriptFiles(parsedFiles){
    const jsFiles = [];

    parsedFiles.forEach(file=>{
        const fileAddress = path.resolve(file.dir, `./app/${file.name}.ts`);
        if(!fileAddress) throw new Error("Could not find the javascript file bounded to " + file.base);

        jsFiles.push(fileAddress);
    })

    return jsFiles;
}

module.exports = getJavascriptFiles;
