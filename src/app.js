const dotenv = require("dotenv")
dotenv.config()

fs = require('fs')
const path = require('path')
const lineReader = require('line-reader')
const mdConverter = require('../lib/converter');

const maxHeadingSize = parseInt(process.env.MAX_HEADING_SIZES)
const defaultEncoding = process.env.DEFAULT_ENCODING

const INPUT_FOLDER = 'INPUT_FILES'
const OUTPUT_FOLDER = 'OUTPUT_FILES'

// read files from file system
const inputPath = path.join(__dirname, `../${INPUT_FOLDER}`)

fs.readdir(inputPath, function (err, files) {
    //handling error first
    if (err) {
        return console.log('Unable to scan INPUT_FILES folder: ' + err);
    }

    files.forEach(function (file) {
        // skip any .gitkeep files
        if (!file.includes('gitkeep')) {
            const inputFile = path.join(__dirname, `../${INPUT_FOLDER}/${file}`)
            const outputFile = path.join(__dirname, `../${OUTPUT_FOLDER}/${file.replace('.md', '.html')}`)

            // use a line reader to allow immediate output and conserve memory
            let lineNum = 0
            lineReader.eachLine(inputFile, function(line, last) {
                lineNum += 1
                let outputLine = ''
                if(line) {
                    const numHashes = mdConverter.getHeadingType(line)
                    if(numHashes > maxHeadingSize) {
                        outputLine = `<p>INVALID MARKDOWN SYNTAX (line ${lineNum})</p>`
                    } else {
                        // no hashes == regular non-header line
                        const linksProcessed = mdConverter.processLinks(line)
                        const plainText = mdConverter.getPlainText(linksProcessed)
                        outputLine = mdConverter.getHtmlText(plainText, numHashes)
                    }
                }

                // since appending - can handle large files
                appendToFile(outputFile, outputLine)

                if (last) {
                    return false
                }
            });
        }
    });
});

const appendToFile = (filePath, line) => {
    const outputLine = mdConverter.addNewline(line);
    fs.writeFileSync(
        filePath,
        outputLine,
        {
            encoding: defaultEncoding,
            flag: "a+",
            mode: 0o666
        });
}