let questionIndex = 0;
let quizTime;   
let timer; 
const timePerQuestion = 15; 
const outOfTime = 'Quiz over. You ran out of time.';   

// Get High Scores
let highscores = [];
if (localStorage.getItem('highscores') !== null) {
  highscores = JSON.parse(localStorage.getItem('highscores'));
}

// Event handler for buttons
$('#answer-options').on('click', '.answer-button', function() {
  checkAnswer($(this).text());
});

$('#view-highscores').on('click', function() {
  showHighscores();
});

$(document).ready(function() {
  resetQuizTime();
  $('#description').text('There are ' + questions.length + ' questions in this quiz.');
});

// Timer
function updateTimeDisplay() {
  $('#time-remaining').text('Time: ' + quizTime);
}

function resetQuizTime() {
  quizTime = questions.length * timePerQuestion;
  updateTimeDisplay();
}

function startTimer() {
  if (quizTime > 0) {
    quizTime--;
    updateTimeDisplay();
  } else {
    clearInterval(timer);
    quizTime = 0;
    updateTimeDisplay();
    endQuiz(outOfTime);
  }
}

// Start the quiz
$('#begin-quiz').on('click', function() {
  resetQuizTime();
  $('header').removeClass('jumbo'); // change the color of the top bar
  $('#main-prompt').addClass('d-none'); // hide the jumbotron
  $('#main-content').removeClass('d-none'); // unhide the question and answer divs
  askQuestion();
  timer = setInterval(startTimer, 1000); // start the timer
});

// Quiz questions
function askQuestion() {
  $('#answer-options').empty();
  $('#quiz-question').text(questions[questionIndex].title);
  for (let i = 0; i < questions[questionIndex].choices.length; i++) {
    let buttonDiv = $('<div class="form-group">'); // Bootstrap div and class to add space between buttons
    let answerButton = $('<button class="btn btn-primary answer-button">');
    $(answerButton).text((i + 1) + '. ' + questions[questionIndex].choices[i]);
    $(buttonDiv).append(answerButton);
    $('#answer-options').append(buttonDiv);
  }
}

function checkAnswer(e) {
  if (e.substring(3, e.length) === questions[questionIndex].answer) { // correct answer
    $('#right-or-wrong').html('<i class="far fa-check-circle"></i> Correct!').css('color', 'green');
    $('#right-or-wrong').removeClass('d-none');
  } else 
  { // wrong answer
    $('#right-or-wrong').html('<i class="far fa-times-circle"></i> Wrong!').css('color', 'red');
    $('#right-or-wrong').removeClass('d-none');
    
    if (quizTime > 10) {
      quizTime -= 10;
      updateTimeDisplay();
    } else {
      clearInterval(timer);
      quizTime = 0;
      updateTimeDisplay();
      endQuiz(outOfTime);
    }
  }
  // hide the "Correct" or "Wrong" notification after 2 seconds.
  setTimeout(function() {
    $('#right-or-wrong').addClass('d-none');
  }, 2000);

  if (questionIndex < questions.length - 1) {
    questionIndex++;
    askQuestion();
  } else {
    clearInterval(timer);
    endQuiz('Quiz has ended.');
  }
}

// End the quiz
function endQuiz(endReason) {
  $('#answer-options').empty();
  $('#quiz-question').text(endReason);
  $('#answer-options').append($('<p>').text('Your final score is ' + quizTime + '.'));
  $('#score-form').removeClass('d-none'); // show the form to enter and submit initials
}

// Submit initials
$('#submit-initials').on('click', function(e) {
  e.preventDefault();

  // newScore object
  let newScore = {
    initials: $('#initials').val(),
    score: quizTime
  }
  
  highscores.push(newScore);
  localStorage.setItem('highscores', JSON.stringify(highscores));

  $('#score-form').addClass('d-none');
  showHighscores();
});

function showHighscores() {
  clearInterval(timer);
  resetQuizTime();
  $('#answer-options').empty();
  $('header').addClass('d-none'); 
  $('#score-form').addClass('d-none'); 
  
  if (!$('#main-prompt').hasClass('d-none')) {
    $('#main-prompt').addClass('d-none');
    $('#main-content').removeClass('d-none');
  }

  $('#highscore-list-buttons').removeClass('d-none');
  $('#quiz-question').addClass('pt-3');
  $('#quiz-question').text('Highscores');

  if (highscores.length === 0) {
    $('#answer-options').append('<p>There are currently no high scores. Will you be the first?</p>');
  } else {
    for (let i = 0; i < highscores.length; i++) {
      let newScore = $('<p class="jumbo">').text((i + 1) + '. ' + highscores[i].initials + ' - ' + highscores[i].score);;
      $('#answer-options').append(newScore);
    }
  }
}

$('#clear-highscores-button').on('click', function() {
  highscores = [];
  localStorage.clear();
  showHighscores();
});

$('#go-back-button').on('click', function() {
  questionIndex = 0;
  $('#quiz-question').removeClass('pt-3');
  $('#main-prompt').removeClass('d-none');
  $('#main-content').addClass('d-none');
  $('header').addClass('jumbo');
  $('header').removeClass('d-none');
  $('#highscore-list-buttons').addClass('d-none');
});