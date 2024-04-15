import express from 'express'
const app = express()

const escapeHTML = str => str.replace(/[&<>'"]/g, 
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));

const userInputWithHTML = "You <em>shouldn't</em> allow <strong>any</strong> html from users to be rendered as html"

function vulnerableAddUserInput(){
    return `
    <p>
    <strong>Here is the user input:</strong> ${userInputWithHTML}
    </p>
    `
}

function fixWithEscapeFunction(){
    return `
    <p>
    <strong>Here is the user input:</strong> ${escapeHTML(userInputWithHTML)}
    </p>
    `
}

import * as cheerio from 'cheerio'
import { parse } from 'path';

function fixWithInnerText(){
    // create html first, with spot for user provided content
    let htmlString =  `
    <p>
    <strong>Here is the user input:</strong> <span id='userInput1'></span>
    </p>
    `

    let parsedHTML = cheerio.load(htmlString)

    // insert user content using innerText (or text)
    parsedHTML('#userInput1').text(userInputWithHTML)

    return parsedHTML.html()
}

app.get("/", (req, res) => {
    res.send(`
    <html><body>
    <h1>demo for xss escaping</h1>

    <h2>vulnerable user input</h2>
    ${vulnerableAddUserInput()}

    <h2>Fix with escape function</h2>
    ${fixWithEscapeFunction()}

    <h2>Fix with innertext</h2>
    ${fixWithInnerText()}
    </body></html>
    `)
})

app.listen(3000, () => {
    console.log("Example app listening at http://localhost:3000"   )
})




