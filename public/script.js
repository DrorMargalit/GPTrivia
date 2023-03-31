var socket = io.connect();
var myNum
var theQuestion = ""
let allButtons = document.getElementsByClassName('answers');
var quesionArray
let responded = false

socket.on('connect', function () {
  console.log("Connected " + socket.id);
});


socket.on('playerNumber', function (data) {
  myNum = data;
  console.log('myNum:' + myNum)
});

socket.on('image', function (data) {
  let drawIndex = getDrawIndex(data)
  let img = data.img;
  let client = data.client;

  let images = document.getElementsByClassName('images');
  images[drawIndex].src = data.img;


});

function getDrawIndex(data) {
  let drawIndex = 0
  if (data.client == myNum) {
    drawIndex = 0
  } else if (data.client == 0) {
    drawIndex = myNum
  } else {
    drawIndex = data.client
  }
  // console.log('draw index:' + drawIndex)
  return drawIndex
}

socket.on('question', function (data) {
  displayQuestions(data)
  // theQuestion = data
  // quesionArray = theQuestion.split('/');

  // allButtons[0].innerHTML = quesionArray[1];
  // allButtons[1].innerHTML = quesionArray[2];
  // allButtons[2].innerHTML = quesionArray[3];
  // allButtons[3].innerHTML = quesionArray[4];

  // allButtons[4].innerHTML = quesionArray[1];
  // allButtons[5].innerHTML = quesionArray[2];
  // allButtons[6].innerHTML = quesionArray[3];
  // allButtons[7].innerHTML = quesionArray[4];

  // allButtons[8].innerHTML = quesionArray[1];
  // allButtons[9].innerHTML = quesionArray[2];
  // allButtons[10].innerHTML = quesionArray[3];
  // allButtons[11].innerHTML = quesionArray[4];

  // allButtons[12].innerHTML = quesionArray[1];
  // allButtons[13].innerHTML = quesionArray[2];
  // allButtons[14].innerHTML = quesionArray[3];
  // allButtons[15].innerHTML = quesionArray[4];

  // document.getElementById("quesion").innerHTML = quesionArray[0]

  // responded = false
})

function displayQuestions(data){
  theQuestion = data
  quesionArray = theQuestion.split('/');

  allButtons[0].innerHTML = quesionArray[1];
  allButtons[1].innerHTML = quesionArray[2];
  allButtons[2].innerHTML = quesionArray[3];
  allButtons[3].innerHTML = quesionArray[4];

  allButtons[4].innerHTML = quesionArray[1];
  allButtons[5].innerHTML = quesionArray[2];
  allButtons[6].innerHTML = quesionArray[3];
  allButtons[7].innerHTML = quesionArray[4];

  allButtons[8].innerHTML = quesionArray[1];
  allButtons[9].innerHTML = quesionArray[2];
  allButtons[10].innerHTML = quesionArray[3];
  allButtons[11].innerHTML = quesionArray[4];

  allButtons[12].innerHTML = quesionArray[1];
  allButtons[13].innerHTML = quesionArray[2];
  allButtons[14].innerHTML = quesionArray[3];
  allButtons[15].innerHTML = quesionArray[4];

  document.getElementById("quesion").innerHTML = quesionArray[0]

  responded = false

}


socket.on("updatedScore", function (data) {
  let drawIndex = getDrawIndex(data);
  let score = data.score
  let client = data.client;


  let drawScores = document.getElementsByClassName('scores');
  drawScores[drawIndex].innerHTML = score[client];


  console.log(score);
  console.log(client)




})

window.addEventListener("load", init);




function init() {

  let allButtons = document.getElementsByClassName('answers');

  for (let i = 0; i < 4; i++) {
    allButtons[i].addEventListener("click", function () {
      // let pressedAnswer = allButtons[i].innerText
      let pressedAnswer = " " + allButtons[i].innerText
      let correctAnswer = quesionArray[5]
      // console.log(pressedAnswer + "," + correctAnswer)
      if (responded == false) {
        if (pressedAnswer == correctAnswer) {
          console.log('you are right!')
          socket.emit("playerAnswer", 1);
        } else {
          console.log('wrong!')
          socket.emit("playerAnswer", 0);
        }

        responded = true
      }
    });
  }

  //buttons
  let questionGenerator = document.getElementById("newQuestion")

  questionGenerator.addEventListener("click", function () {
    console.log("new question!")
    socket.emit('newQuestion', 1);
  })



  let video = document.getElementById('video0');

  let constraints = { audio: false, video: true }

  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {

    video.srcObject = stream;

    video.onloadedmetadata = function (e) {
      video.play();
    };
  })
    .catch(function (err) {
      /* Handle the error */
      alert(err);

    });

  var thecanvas = document.getElementById('canvas0');
  var thecontext = thecanvas.getContext('2d');

  var draw = function () {
    thecontext.drawImage(video, 0, 0, 320, 240);

    var data = {
      img: thecanvas.toDataURL(),
      client: myNum
    }
    socket.emit('image', data);



    setTimeout(draw, 1000);
  };

  draw();

}




