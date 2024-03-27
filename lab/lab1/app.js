const express = require('express')
const app = express()

const port = 3000;

app.get('/', (req, res) => {    
    res.send("Hello world");
});

app.get('/getProfile', (req, res) => {
    const user = req.query.userName;
    console.log(user);
    if (user === "user1") {
        res.send("user1");
    } else if (user === "user2") {
        res.send("user2");
    }
});


app.listen(port, (req, res) => {
    console.log("Listening to port: " + port);
})