import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


function addUserWebsocket(app){
  let socketCounter = 1
  let allSockets = []
  
  // NOTE: I have to manually add "/users" here
  app.ws('/users/chatSocket', (ws, res) => {
      let mySocketNum = socketCounter
      socketCounter++
      console.log("user " + mySocketNum + " connected via websocket")
  
      // add this ws to the global array tracking all websockets
      allSockets.push(ws)
  
      ws.on('message', chatMsg => {
          console.log(`msg (user ${mySocketNum}):  ${chatMsg}`)
          // I want to send the message I got to all the other
          // browsers connected (using their websockets)
          allSockets.forEach(socket => {
              socket.send(`${mySocketNum}: ${chatMsg}`)
          })
      })
  
      ws.on('close', () => {
          console.log(`user ${mySocketNum} disconnected`)
          console.log("I should probably delete them from the array or something")
      })
  
  })
}

export {router as usersRouter, addUserWebsocket};
