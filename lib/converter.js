const regxPrefixHashes = new RegExp(/^(#+).*$/i);
const regxMdLinks = new RegExp(/^([^\[]+)\[(.+)\]\((.+)\)(.*)$/i);

const getHeadingType = (line) => {
    const matches = line.match(regxPrefixHashes)
    if(matches) {
        return (matches[1]).length
    } else {
        return 0
    }
}

const getPlainText = (line) => {
    const mdHdrToken =  new RegExp(/^#+ /)
    return line.replace(mdHdrToken, '')
}

const getHtmlText = (line, size) => {
    return (size > 0) ? `<h${size}>${line}</h${size}>` : `<p>${line}</p>`
}

const processLinks = (line) => {
    const matches = line.match(regxMdLinks)
    if(matches) {
        const preamble = matches[1]
        const linkText = matches[2]
        const href = matches[3]
        const suffix = matches[4]

        return `${preamble}<a href="${href}">${linkText}</a>${suffix}`
    }

    return line
}

const addNewline = (input) => {
    return `${input}\n`
}

module.exports.getHeadingType = getHeadingType
module.exports.getPlainText = getPlainText
module.exports.processLinks = processLinks
module.exports.getHtmlText = getHtmlText
module.exports.addNewline = addNewline