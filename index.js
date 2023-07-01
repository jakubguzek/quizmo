var questions;
fetch("./questions.json").then(response => questions = response.json());
var currentQuestion = {}
const questionElement = document.getElementById("question-text");
const formElement = document.getElementById("answers-form");
formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

const submitButton = document.createElement("button");
submitButton.innerText = "Sprawdź"
submitButton.setAttribute("onclick", "check()")

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function check() {
  const answer = new FormData(formElement);
  const result = document.getElementById("result")
  try {
    currentQuestion = {
      ...currentQuestion,
      chosenAnswer: answer.get("answer").valueOf()
    }
    console.log(currentQuestion);
    if (currentQuestion.chosenAnswer === currentQuestion.correct) {
      result.innerHTML = "<i class='fa-solid fa-check'></i> Dobrze!";
      result.style["color"] = "green";
    } else {
      result.innerHTML = "<i class='fa-solid fa-xmark'></i> Źle, spróbuj jeszcze raz, albo wylosuj nowe pytanie.";
      result.style["color"] = "red";
    }
  } catch (err) {
    if (err.name === "TypeError") {
      result.innerText = "Nie wybrano żadnej odpowiedzi!";
      result.style["color"] = "red";
    };
  };
};

function answersToForm(formElement, answers) {
  formElement.innerHTML = "";
  const answerElements = shuffle(
    answers.map(answer => {
      const input = document.createElement("input")
      input.setAttribute("type", "radio")
      input.setAttribute("name", "answer")
      input.setAttribute("class", "answer-radio")
      input.setAttribute("id", `a${answer.id}`)
      input.setAttribute("value", answer.text)
      const label = document.createElement("label")
      label.setAttribute("for", `a${answer.id}`)
      label.setAttribute("class", "answer-label")
      label.innerText = answer.text
      return [input, label]
    })
  );
  answerElements.forEach(item => {
    formElement.appendChild(item[0])
    formElement.appendChild(item[1])
    formElement.appendChild(document.createElement("br"))
  });
};

function renderQuestion(questionIndex) {
  questionElement.innerText = questions[questionIndex].question;
  answersToForm(formElement, questions[questionIndex].answers);
  document.getElementById("result").innerText = "";
};

function nextQuestion() {
  var questionIndex;
  console.log(questions.length)
  if (currentQuestion.id === undefined || currentQuestion.id > questions.length) {
    questionIndex = 0;
  } else {
    questionIndex = currentQuestion.id + 1;
  };
  console.log(questionIndex)
  renderQuestion(questionIndex);
}

function randomQuestion() {
  const questionIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = {
    ...questions[questionIndex]
  };
  renderQuestion(questionIndex);
}

document.addEventListener("DOMContentLoaded", nextQuestion());
