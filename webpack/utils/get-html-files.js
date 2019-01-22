const fs = require("fs");
const path = require("path");

function getHTMLFiles(clientFolder){
    if (!fs.existsSync(clientFolder)){
        throw new Error("client folder not found.")
    }

    const files = fs.readdirSync(clientFolder);
    const file_list = [];

    files.forEach(file=>{
        if(file.match(/\.hbs$/ig)){
            file_list.push(path.resolve(clientFolder, file));
        }
    })

    return file_list
}

module.exports = getHTMLFiles;