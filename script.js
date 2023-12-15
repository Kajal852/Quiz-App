let currentQuestion = 0;
let score = 0;
let highScores = 0;
let userName = "";
let selectedOption = "";//Selected Value
let quizData = [];//Array of Questions


async function loadingQuizData(){
    console.log("Loading Quiz Data....");
    const res = await fetch("quizData.json");
    quizData = await res.json();
    console.log("Quiz Data>>>",quizData);
    loadQuestion();
}

function loadQuestion() {
    console.log("currentQuestion", quizData[currentQuestion]);
    const questionObj = quizData[currentQuestion];
    document.getElementById("question").innerText = questionObj.question;
    for(let i=0; i<4; i++){
        const btn = document.getElementById(`btn${i}`);
        btn.innerText = questionObj.options[i];
        btn.className = "option-btn";
        btn.disabled = false;
        btn.style.opacity = 1;
        btn.style.cursor = "default";
    }
    document.getElementById("message").innerText = "";
    document.getElementById("next-btn").style.display = "none";
}

//Start Quiz Logic
function startQuiz(){
    userName = prompt("Enter your UserName");
    if (userName) {
        document.getElementById("username").innerText = userName;
        document.getElementById("start-page").style.display="none";
        document.getElementById("quiz-container").style.display="block";
        loadingQuizData();
    } 
    else {
        alert("Please Enter your UserName!!");
    }
}

document.getElementById("start-btn").addEventListener("click", startQuiz);

//Event Listner Options
for (let i = 0; i < 4; i++) {
    document.getElementById(`btn${i}`).addEventListener("click", (event) => {
      selectedOption = event.target;
      if (quizData[currentQuestion].options[i] === quizData[currentQuestion].answer) {
        score++;
        document.getElementById("score").innerText = score;
        selectedOption.className = "option-btn correct";
        document.getElementById("message").innerText = "Correct Answer!";
      } else {
        selectedOption.className = "option-btn wrong";
        document.getElementById("message").innerText = "Wrong Answer!";
      }
      for (let j = 0; j < 4; j++) {
        document.getElementById(`btn${j}`).disabled = true;
        document.getElementById(`btn${j}`).style.cursor = "not-allowed";
        document.getElementById(`btn${j}`).style.opacity = 0.5;
      }
      selectedOption.style.opacity = 1;
      document.getElementById("next-btn").style.display = "block";
    });
}

document.getElementById("next-btn").addEventListener("click", (event) => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        //next question
        loadQuestion();
        const progress = (currentQuestion / quizData.length) * 100;
        document.getElementById("progress-bar-fill").style.width = `${progress}%`;
        document.getElementById("progress-bar-text").innerText = `${Math.round(progress)}%`;
    } 
    else {
        //endquiz
        endQuiz();
    }
});

function endQuiz() {
    document.getElementById("quiz-container").style.display="none";
    document.getElementById("score-container").style.display="block";
    document.getElementById("score-text").innerText = score;

    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({
      username: userName,
      score: score,
      date: new Date().toISOString(),
    });
    localStorage.setItem("scores", JSON.stringify(scores));

    currentQuestion = 0;
    selectedOption = "";
    score = 0;
    highScores = 0;
    userName = "";
    const progress = (currentQuestion / quizData.length) * 100;
    document.getElementById("progress-bar-fill").style.width = `${progress}%`;
    document.getElementById("progress-bar-text").innerText = `${Math.round(progress)}%`;
    
}

document.getElementById("restart-btn").addEventListener("click", (event) => {
    document.getElementById("score-container").style.display="none";
    document.getElementById("start-page").style.display="block";
});

document.getElementById("go-back-btn").addEventListener("click", (event) => {
  document.getElementById("highscore-page").style.display="none";
  document.getElementById("start-page").style.display="block";
});



document.getElementById("highscore-btn").addEventListener("click", (event) => {
    document.getElementById("highscore-page").style.display="block";
    document.getElementById("start-page").style.display="none";
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    document.getElementById("highscores").innerHTML = scores
    .map(
      (item) =>
        `<p>${item.username}: ${item.score} (on ${new Date(
          item.date
        ).toLocaleDateString()} at ${new Date(
          item.date
        ).toLocaleTimeString()})</p>`
    )
    .join("");
});