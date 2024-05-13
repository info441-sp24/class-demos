import express from 'express'
import enableWs from 'express-ws'

const app = express()
enableWs(app)

let socketCounter = 1
let allSockets = {}

app.ws('/chatSocket', (ws, res) => {
    let mySocketNum = socketCounter
    socketCounter++
    console.log("user " + mySocketNum + " connected via websocket")

    // add this ws to the global object tracking all websockets
    allSockets[mySocketNum] = {
        socket: ws,
        name: mySocketNum
    }

    ws.on('message', msg => {
        try{
            const socketMessage = JSON.parse(msg)
            if(socketMessage.action == "sendChat"){
                console.log(`msg (user ${mySocketNum}):  ${socketMessage.chat}`)
                const myName = allSockets[mySocketNum].name
                // I want to send the message I got to all the other
                // browsers connected (using their websockets)
                for(const [SocketNum, socketInfo] of Object.entries(allSockets)){
                    socketInfo.socket.send(`${myName}: ${socketMessage.chat}`)
                }
            }else if (socketMessage.action == "updateName"){
                console.log("user " + mySocketNum + " is trying to update their name to " + 
                    socketMessage.name
                )
                allSockets[mySocketNum].name = socketMessage.name
            }else {
                console.error("got unexpected action " + socketMessage.action)
            }
        }catch(error){
            console.error("Websocket message received error: " + error)
        }
        
    })

    ws.on('close', () => {
        delete allSockets[mySocketNum]
        console.log(`user ${mySocketNum} disconnected`)
    })

})

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + "/index.html")
})

app.listen(3000, () => {
    console.log("Example app listening at http://localhost:3000")
})