const ROWS = 25;
const COLS = 45;
const SPEED = 5;
var SCORE = 0;
var intervals = [1000, 700, 350, 200, 100];
snake = [0, 1, 2, 3, 4, 5];

var keyPressed = false;
var stopped = true;
var paused = true;
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
var playingStatus = document.getElementById("playingStatus");
var score = document.getElementById("score");



//generate table
//ref.   https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces

function generate_table(rows, cols) {
  // get the reference for the body
  var body = document.getElementsByTagName("body")[0];

  // creates a <table> element and a <tbody> element
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");

  // creating all cells
  for (var i = 0; i < rows; i++) {
    // creates a table row
    var row = document.createElement("tr");

    for (var j = 0; j < cols; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      var cell = document.createElement("td");
      var cellText = document.createTextNode("");
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);

  // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "2");
}

generate_table(ROWS, COLS); // 17 ,35

let main = document.getElementsByClassName("main")[0]; //..getEl..sByClassName() returns an array like collection
let table = document.getElementsByTagName("table")[0];

main.appendChild(table);
table.classList.add("grid");
function highlight(boxNumber) {
  theBox = boxes[boxNumber];
  if (theBox) {
    theBox.classList.add("highlight");
  } else {
    console.log("number inv " + boxNumber);
    //stopHandler(); //stop game
  }
}
let boxes = document.getElementsByTagName("td");
let totalBoxes = boxes.length;
//console.log(boxes.length);

function drawFood() {
  let randomFoodPosition = Math.floor(Math.random() * (totalBoxes + 1));

  highlight(randomFoodPosition);
  boxes[randomFoodPosition].classList.add("food");
}

function unHighlight(boxNumber) {
  theBox = boxes[boxNumber];
  if (theBox) {
    theBox.classList.remove("highlight");
  }
}

function handleSelfCollision(boxNumber) {
  let theBox = boxes[boxNumber];
  if (theBox.classList.contains("highlight")) {
    console.log("self collided");
    stopHandler(); //stop game
  }
}

function handleFoodCollision(boxNumber) {
  let theBox = boxes[boxNumber];
  if (theBox.classList.contains("food")) {
    SCORE += 1;

    theBox.classList.remove("food");
    updateSnake(); // show updated snake after eating food
    updateScore(); //show updated score every time after eating
    drawFood(); // draw next food after eating
  }
}

/*
function update(boxes, dir) {
  newSnake = [];
  let snakeLength = boxes.length;
  let snakeLastNode = boxes[snakeLength - 1];
  console.log(snakeLastNode);
  if (snakeLastNode > 1125 || snakeLastNode < 0) {
    console.log("are are..");
    newSnake.push(...boxes, 0);
  }
  if (dir == "r") {
    newSnake.push(...boxes, snakeLastNode + 1);
  } else if (dir == "l") {
    newSnake.push(...boxes, snakeLastNode - 1);
  } else if (dir == "u") {
    newSnake.push(...boxes, snakeLastNode - COLS);
  } else if (dir == "d") {
    newSnake.push(...boxes, snakeLastNode + COLS);
  } else {
    console.log("nothing");
  }

  return newSnake;
}
*/

//test
function update(boxes, dir) {
  newSnake = [];
  let snakeLength = boxes.length;
  let snakeHeadNode = boxes[snakeLength - 1];
  let snakeTail = boxes[0];
  //console.log(snakeLastNode);
  if (snakeTail < 0) {
    //snakeLastNode += 1;
    snakeHeadNode = 0;
    //newSnake.push(0, 1, 2, 3, 4, 5);
    newSnake = [0, 1, 2, 3, 4, 5];
    globalThis;
    dir == "r";
    return newSnake;
  }
  // if (snakeLastNode == 0) {
  //   dir = "r";
  // }

  if (dir == "r") {
    snakeHeadNode = snakeHeadNode + 1;
  } else if (dir == "l") {
    snakeHeadNode = snakeHeadNode - 1;
  } else if (dir == "u") {
    snakeHeadNode = snakeHeadNode - COLS;
  } else if (dir == "d") {
    snakeHeadNode = snakeHeadNode + COLS;
  } else {
    console.log("nothing");
  }
  if (snakeHeadNode > 1125) {
    // || snakeLastNode < 0) {
    console.log("are are..");
    snakeHeadNode = 0;
  }
  //console.log("head " + snakeHeadNode);
  newSnake.push(...boxes, snakeHeadNode);
  //console.log(newSnake);
  return newSnake;
}
//test

function draw(boxes) {
  boxes.forEach((box) => {
    if (0 <= box && box <= totalBoxes) {
      handleSelfCollision(box);
      handleFoodCollision(box);
      highlight(box);
    }
  });
}

//clean table
function cleanTable() {
  for (var i = 0; i < totalBoxes; i++) {
    unHighlight(i);
  }
}
//

let dir = "r";
draw(snake); //draw initial snake
drawFood(); //draw initial food
function render(s, dir) {
  cleanTable();
  //drawFood(); //it draws food at every move(step) of snake
  //when we handleFoodCollision for food the class "food"/"highlight" is again added after each step

  snake = update(s, dir); // update snake array as per direction
  draw(snake);

  snake.shift(); //shift() removes first element from snake array
}

function handleEvent(event) {
  // if (paused) {
  //   pauseHandler();
  // }
  keyPressed = true; //at any keypress keyPressed is set to true //it canbe anykey on keyboard
  if (event.code == "ArrowRight") {
    if (dir == "l") {
      //avoid Right dir while moving Left
      return;
    }
    dir = "r";
  }
  if (event.code == "ArrowLeft") {
    if (dir == "r") {
      //avoid Left dir while moving Right
      return;
    }
    dir = "l";
  }
  if (event.code == "ArrowDown") {
    if (dir == "u") {
      //avoid Down dir while moving Up
      return;
    }
    dir = "d";
  }
  if (event.code == "ArrowUp") {
    if (dir == "d") {
      //avoid Up dir while moving Down
      return;
    }
    dir = "u";
  }
  if (event.code == "Space") {
    pauseHandler();
  }
  if (event.code == "Escape") {
    stopHandler();
  }
  return dir;
}

document.addEventListener("keydown", handleEvent);

function getDir() {
  if (keyPressed) {
    return dir;
  } else {
    return "r"; // default dir when the game starts
  }
}

function done() {
  //when game is over/done do this before stopping
  //sara raiyta smet lo
  console.log("stopping..");
  playingStatus.innerHTML = "Stopped! You Score is " + SCORE;
  pauseButton.style.visibility = "hidden"; // hide pause play button when game stopped
}

function pauseHandler() {
  paused = !paused;
  stopped = !stopped;
  if (paused) {
    pauseButton.innerHTML = "|&gt;";

    playingStatus.innerHTML = "Paused";
  } else {
    pauseButton.innerHTML = "|&nbsp;|";
    playingStatus.innerHTML = "Playing.. "; //+ SCORE;
    //updateScore(); //using updateScore() to handle score displaying part separately.
    //as score needs to be updated everytime at handleFoodCollision()
    //but here score is only updated when pauseHandler() is called
  }
}

function updateSnake() {
  //add new node to the snake in the begining(head)
  var snakeHead = snake[snake.length - 1];
  if (dir == "r") {
    snake.push(snakeHead + 1);
  } else if (dir == "l") {
    snake.push(snakeHead - 1);
  } else if (dir == "u") {
    snake.push(snakeHead - 45);
  } else if (dir == "d") {
    snake.push(snakeHead + 45);
  }
}

function updateScore() {
  //playingStatus.innerHTML = "Playing.. " + SCORE;
  score.innerHTML = SCORE;
}
function stopHandler() {
  stopped = !stopped; //helps in breaking setInterval loop . without using this flag setInterval
  //was not breaking.
  done();
  clearInterval(refreshWindow); // breaks out the setInterval loop
}

render(snake, dir);
function renderer() {
  d = getDir();
  render(snake, d);
}
// setInterval(renderer, 400);

var refreshWindow = setInterval(
  function () {
    if (!stopped) {
      //if not stopped then do..
      renderer();
    }
  },

  intervals[SPEED - 1] // choose interval(from intervals arr) depending upon SPEED
);

stopButton.onclick = function () {
  stopHandler();
};

pauseButton.onclick = function () {
  pauseHandler();
};
