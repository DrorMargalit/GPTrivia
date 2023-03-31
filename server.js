var promptToPass = "generate a four-choice trivia question as a string formatted like this: the question '/' each answer '/' correct response";

var clientNum = 0
let gptResponse
let socketIDs = []
let playerNumber
var quesionArray = []
let scoreCounter = []
let responseNumber = 0




var fs = require('fs');

var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!')
});

var https = require('https');

var options = {
  key: fs.readFileSync('privkey1.pem'),
  cert: fs.readFileSync('cert1.pem')
};

var httpServer = https.createServer(options, app);

httpServer.listen(443);

const { Server } = require('socket.io');
const io = new Server(httpServer, {})



io.sockets.on('connection',
  function (socket) {
    console.log("We have a new client: " + socket.id);
    socketIDs.push(socket.id);
    scoreCounter.push(0)
    console.log(scoreCounter)

    playerNumber = socketIDs.indexOf(socket.id);

    socket.emit('playerNumber', playerNumber)


    console.log(playerNumber)

    socket.on('image', function (data) {
      io.emit('image', data)
    })


    socket.on('newQuestion', function (data) {

      runCompletion(promptToPass);
    })

    socket.on('disconnect', function () {
      console.log("Client has disconnected " + socket.id);
      let disconnectedPlayer = socketIDs.indexOf(socket.id);

      // clientNum--
      socketIDs.splice(disconnectedPlayer, 1);
      scoreCounter.splice(disconnectedPlayer, 1);
      console.log(scoreCounter)
      for (i = 0; i <= socketIDs.length; i++) {
        playerNumber = socketIDs.indexOf(socketIDs[i]);
        io.to(socketIDs[i]).emit('playerNumber', playerNumber)
        console.log(playerNumber)
      }

    });


    const { Configuration, OpenAIApi } = require("openai");


    const configuration = new Configuration({
      apiKey: "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"
      // apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    async function runCompletion(prompt) {
      const completion = await openai.createChatCompletion({

        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt }
        ],
      });
      gptResponse = completion.data.choices[0].message.content;
      console.log(gptResponse);
      quesionArray = gptResponse.split('/');
      console.log(quesionArray);

      if (quesionArray.length < 6) {
        runCompletion(promptToPass);
        console.log('running again')
      } else {
        io.emit('question', gptResponse);
      }
    };



    socket.on("playerAnswer", function (pressedAnswer) {

      let playerID = socketIDs.indexOf(socket.id);
      if (pressedAnswer == 1) {
        scoreCounter[playerID]++
      }
      var data = {
        score: scoreCounter,
        client: playerID
      }
      io.emit("updatedScore", data);
      responseNumber++
      if (responseNumber == socketIDs.length){
        runCompletion(promptToPass);
        responseNumber = 0
      }
    
     
    });



    


  })




// qustion equals new Array in bracets form... and put the ansers in this array... call the array pupmckins so I can excat... 

//works
//generate a multiple-choice trivia question, put the question in a Javascript variable "question", put the answers in the array "answers", and put the correct response in a variable "correct

//works!!!
//generate a multiple-choice trivia question as a string formatted like this: the question "n/" the answers "n/" correct response