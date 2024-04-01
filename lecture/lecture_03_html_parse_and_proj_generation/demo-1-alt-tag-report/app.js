import fetch from 'node-fetch'
import parser from 'node-html-parser'

// fetch a page's html
let url = "https://ischool.uw.edu"
let response = await fetch(url)
let pageText = await response.text()

console.log(pageText)

// parse html 
let htmlPage = parser.parse(pageText)

//find image tag info
let imgTags = htmlPage.querySelectorAll("img")
for(let i = 0; i < imgTags.length; i++){
    let imgTag = imgTags[i]

    console.log("Image " + i + " info:")
    console.log("alt text: " + imgTag.attributes.alt)
    console.log("img src:" + imgTag.attributes.src)
    console.log("\n\n")
}