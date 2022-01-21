var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;

function playSound(name) {
  var randomChosenColorSound = new Audio("sounds/" + name + ".mp3");
  randomChosenColorSound.play();
}

function animationPress(currentColour) {
  $("div." + currentColour).addClass("pressed");
  $("h2." + currentColour).addClass("pressedtext");
  setTimeout(function() {
    $("div." + currentColour).removeClass("pressed");
  }, 100);
  setTimeout(function() {
    $("h2." + currentColour).removeClass("pressedtext");
  }, 100);
}
// ------------------------------------------------- //

function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4); //0-4
  var randomChosenColor = buttonColors[randomNumber]; //picks random color
  playSound(randomChosenColor);
  $("#" + randomChosenColor).fadeOut(100).fadeIn(100);

  gamePattern.push(randomChosenColor);
  level++;
  $("h1").text("Level " + level);
  userClickedPattern = []; //reset saved user clicks
}

$(document).on("keypress", function(event) {
  if (started === true) {
    switch (event.key) {
      case "q":
        buttonClicked("green");
        break;
      case "p":
        buttonClicked("red");
        break;
      case "s":
        buttonClicked("yellow");
        break;
      case "l":
        buttonClicked("blue");
        break;
    }

  }

  if (event.key === "a" && started === false) {
    $("h3").remove();
    nextSequence();
    started = true;
  }
})

$(".btn").on("click", function() {
  if (started === true) {
    var userChosenColour = $(this).attr("id");
    buttonClicked(userChosenColour);
  }
})

function buttonClicked(btn) {
  userClickedPattern.push(btn);
  animationPress(btn);
  playSound(btn);

  if (checkAnswer(level) === true) {
    setTimeout(function() {
      nextSequence();
    }, 200);

  } else if (checkAnswer(level) === false) {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 100);

    $("h1").text("Game Over, Press A Key to Restart");
    $("h1").after("<h3>Score " + level + "!</h3>");
    if (level <= 5) {
      $("h3").after("<h3>You Suck! BAHAHAHAHAHAHAH</h3>");
    } else if (5 < level < 15) {
      $("h3").after("<h3>Hmmmmmmmm nice...</h3>");
    } else {
      $("h3").after("<h3>HOLY POGCHAMP!!</h3>");
    }
    startOver();
  }
}



var cur = 0; //current stage in sequence
function checkAnswer(currentLevel) {

  if (userClickedPattern[cur] === gamePattern[cur]) {
    cur++;
  }

  if ((userClickedPattern[cur] != gamePattern[cur]) && (userClickedPattern[cur] != undefined)) {
    return false;
  }

  if (cur === currentLevel) {
    cur = 0;
    return true;
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  cur = 0;
}
