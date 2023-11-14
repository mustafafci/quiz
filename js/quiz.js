// select elements
const displayCount = document.getElementById("number-of-questions");
const bulletContainer = document.querySelector(".bullets .bullets-container");
const questionTitle = document.querySelector(".question .title");
const answersContainer = document.querySelector(".answers ul");
const submitBtn = document.getElementById("submit");
const answersInput = document.getElementsByName("answers");
const results = document.getElementById("results");
const time = document.querySelector(".bullets .time");

//variables
let currentQuestion = 0;
let numberOfQuestion = 0;
let answers = ["A", "B", "C", "D"];
let correctAnswers = 0;
const timer = 5;
let countTimer;

// get question from json file
function getQuestion() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const questions = JSON.parse(this.responseText);
      numberOfQuestion = questions.length;

      // create bullets
      createBullets();

      displayQuestion(questions[currentQuestion]);

      // timer
      countDown(timer);

      submitBtn.addEventListener("click", () => {
        // checkAnswer
        checkAnswer(questions);
        // increase index to get next question
        currentQuestion++;

        questionTitle.innerHTML = "";
        answersContainer.innerHTML = "";
        // display next question
        displayQuestion(questions[currentQuestion]);

        activeBullets();

        clearInterval(countTimer);
        countDown(timer);

        if (currentQuestion === numberOfQuestion) {
          showResults();
        }
      });
    }
  };
  xhr.open("get", "js/quiz.json");
  xhr.send();
}
getQuestion();

// create bullets
function createBullets() {
  for (let i = 0; i < numberOfQuestion; i++) {
    const bullet = document.createElement("span");
    bullet.className = "bg-info-subtle rounded-circle d-inline-block me-2";
    i === 0 ? bullet.classList.add("active") : "";

    bulletContainer.appendChild(bullet);
  }
}

// display question
function displayQuestion(question) {
  if (currentQuestion < numberOfQuestion) {
    displayCount.innerHTML = `Question ${
      currentQuestion + 1
    } of ${numberOfQuestion}`;

    questionTitle.innerHTML = question.question;

    for (let i = 1; i <= 4; i++) {
      const li = document.createElement("li");
      li.className = "rounded p-2 my-2";

      const radioInput = document.createElement("input");
      radioInput.setAttribute("type", "radio");
      radioInput.className = "form-check-input ms-2";
      radioInput.id = `answer_${i}`;
      radioInput.name = "answers";
      radioInput.dataset.answer = answers[i - 1];

      const label = document.createElement("label");
      const labelText = document.createTextNode(question[answers[i - 1]]);
      label.appendChild(labelText);
      label.setAttribute("for", `answer_${i}`);

      li.appendChild(radioInput);
      li.appendChild(label);
      answersContainer.appendChild(li);
    }
  }
}

// check naswer
function checkAnswer(questions) {
  // get right answer
  if (currentQuestion < numberOfQuestion) {
    rightAnswer = questions[currentQuestion].answer;
    let chosenAnswer;
    for (let i = 0; i < 4; i++) {
      if (answersInput[i].checked) {
        chosenAnswer = answersInput[i].dataset.answer;
      }
    }
    console.log(rightAnswer);
    // console.log(chosenAnswer);
    if (chosenAnswer === rightAnswer) {
      correctAnswers++;
    }
  }
}

function activeBullets() {
  let bulletSpan = Array.from(
    document.querySelectorAll(".bullets-container span")
  );
  bulletSpan.forEach((span, index) => {
    if (index === currentQuestion) {
      span.classList.add("active");
    }
  });
}

//show results

function showResults() {
  if (currentQuestion === numberOfQuestion) {
    questionTitle.parentElement.remove();
    displayCount.remove();
    answersContainer.remove();
    submitBtn.remove();

    if (correctAnswers < numberOfQuestion / 2) {
      results.innerHTML = `You answered ${correctAnswers} of ${numberOfQuestion} This is very bad try again`;
      results.className = "alert alert-danger";
    } else if (correctAnswers < numberOfQuestion) {
      results.innerHTML = `You answered ${correctAnswers} of ${numberOfQuestion}`;
      results.className = "alert alert-info";
    } else {
      results.innerHTML = `All Answers is correct <strong>perfect</strong>`;
      results.className = "alert alert-primary";
    }
  }
}

//count down
function countDown(duration) {
  countTimer = setInterval(() => {
    let minutes = parseInt(duration / 60);
    let seconds = parseInt(duration % 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    time.innerHTML = `${minutes}:${seconds}`;

    if (--duration < 0) {
      clearInterval(countTimer);
      submitBtn.click();
    }
  }, 1000);
}
