import {promises as fs} from 'fs'
import fetch from 'node-fetch'
import parser from 'node-html-parser'
import express from 'express'
const app = express()

app.get('/', async (req, res) => {
    console.log("request to '/', sending back html")
    res.type('html')
    let fileContents = await fs.readFile("index.html")
    res.send(fileContents)
})

app.get('/style.css', async (req, res) => {
    console.log("request to '/style.css', sending back css content")
    res.type('css')
    let fileContents = await fs.readFile("style.css")
    res.send(fileContents)
})

app.get('/index.js', async (req, res) => {
    console.log("request to '/index.js', sending back js content")
    res.type('js')
    let fileContents = await fs.readFile("index.js")
    res.send(fileContents)
})

app.get('/favicon.ico', async (req, res) => {
    console.log("request to '/favicon.ico', sending back png content")
    res.type('png')
    let fileContents = await fs.readFile("favicon.ico")
    res.send(fileContents)
})

app.get('/api/auditurl', async (req, res) => {
    // get html from the url
    let url = req.query.url
    let response = await fetch(url)
    let pageText = await response.text()

    // parse html
    let htmlPage = parser.parse(pageText)

    // go through each img tag and create html
    let htmlReturn = ""
    let imgTags = htmlPage.querySelectorAll("img")
    for(let i = 0; i < imgTags.length; i++){
        console.log("Image " + i)
        let imgTag = imgTags[i]

        htmlReturn += "<h3>Image " + i + " info:</h3>"
        htmlReturn += "<p>alt text: " + imgTag.attributes.alt + "</p>"
        htmlReturn += "<p>img src: " + imgTag.attributes.src + "</p>"
        htmlReturn += "<img src='"+ url + imgTag.attributes.src +"' />"
    }

    res.type("html")
    res.send(htmlReturn)
})

app.listen(3000, () => {
    console.log("Example app listening at http://localhost:3000")
})