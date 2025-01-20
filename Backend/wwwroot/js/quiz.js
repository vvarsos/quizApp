let quizData = null;
let currentQuestionIndex = 0;
let userPoints = 0;
let totalPoints = 0;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1) Fetch the quiz data from the server
    const response = await fetch("https://localhost:5001/api/quiz");
    quizData = await response.json();

    // 2) Display quiz title & description
    document.getElementById("quizTitle").textContent = quizData.title || "Untitled Quiz";
    if (quizData.description) {
      document.getElementById("quizDescription").textContent = quizData.description;
    }

    // 3) Calculate total points
    quizData.questions.forEach(q => {
      totalPoints += q.points;
    });

    // 4) Show the first question
    showQuestion(currentQuestionIndex);

    // 5) Attach event listener to the "Submit Answer" button
    const submitBtn = document.getElementById("submitAnswerBtn");
    submitBtn.addEventListener("click", onSubmitAnswer);

  } catch (err) {
    console.error("Error fetching quiz data:", err);
  }
});

// Renders the current question
function showQuestion(index) {
  const questionObj = quizData.questions[index];
  const questionTextEl = document.getElementById("questionText");
  const answersListEl = document.getElementById("answersList");
  const feedbackEl = document.getElementById("feedback");

  // Determine background image based on the question title
  const bgImage = getBackgroundForGame(questionObj.title);
  document.body.style.background = `${bgImage} no-repeat center center fixed`;
  document.body.style.backgroundSize = "cover";

  // Clear previous feedback
  feedbackEl.textContent = "";

  // Update question text
  questionTextEl.textContent = questionObj.title;

  // Clear old answers
  answersListEl.innerHTML = "";

  // Determine how to render the answers
  switch (questionObj.question_type) {
    case "multiplechoice-single":
      // Create radio inputs
      questionObj.possible_answers.forEach(pa => {
        const li = document.createElement("li");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = pa.a_id;
        li.appendChild(input);

        const label = document.createTextNode(" " + pa.caption);
        li.appendChild(label);

        answersListEl.appendChild(li);
      });
      break;

    case "multiplechoice-multiple":
      // Create checkboxes
      questionObj.possible_answers.forEach(pa => {
        const li = document.createElement("li");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "answer";
        input.value = pa.a_id;
        li.appendChild(input);

        const label = document.createTextNode(" " + pa.caption);
        li.appendChild(label);

        answersListEl.appendChild(li);
      });
      break;

    case "truefalse":
      // Two radio inputs for True/False
      const liTrue = document.createElement("li");
      const inputTrue = document.createElement("input");
      inputTrue.type = "radio";
      inputTrue.name = "answer";
      inputTrue.value = "true";
      liTrue.appendChild(inputTrue);
      liTrue.appendChild(document.createTextNode(" True"));
      answersListEl.appendChild(liTrue);

      const liFalse = document.createElement("li");
      const inputFalse = document.createElement("input");
      inputFalse.type = "radio";
      inputFalse.name = "answer";
      inputFalse.value = "false";
      liFalse.appendChild(inputFalse);
      liFalse.appendChild(document.createTextNode(" False"));
      answersListEl.appendChild(liFalse);
      break;

    default:
      console.error("Unknown question type:", questionObj.question_type);
      break;
  }
}

/**
 * Called when user clicks "Submit Answer".
 */
function onSubmitAnswer() {
  const questionObj = quizData.questions[currentQuestionIndex];
  const feedbackEl = document.getElementById("feedback");

  let isCorrect = false;

  // Collect user input from #answersList
  const inputs = document.querySelectorAll("#answersList input[name='answer']");

  switch (questionObj.question_type) {
    case "multiplechoice-single": {
      // Expect exactly one radio
      let selectedValue = null;
      inputs.forEach(input => {
        if (input.checked) {
          selectedValue = parseInt(input.value, 10);
        }
      });
      // Compare to correct_answer
      if (selectedValue === questionObj.correct_answer) {
        isCorrect = true;
      }
      break;
    }
    case "multiplechoice-multiple": {
      // Checkboxes
      let selectedValues = [];
      inputs.forEach(input => {
        if (input.checked) {
          selectedValues.push(parseInt(input.value, 10));
        }
      });
  
      const correctArr = Array.isArray(questionObj.correct_answer)
        ? questionObj.correct_answer
        : [];
      // Compare sorted arrays
      if (arraysEqual(sortNumeric(selectedValues), sortNumeric(correctArr))) {
        isCorrect = true;
      }
      break;
    }
    case "truefalse": {
      // True/False radio
      let selectedBool = null;
      inputs.forEach(input => {
        if (input.checked) {
          selectedBool = (input.value === "true");
        }
      });
      // correct_answer is a boolean
      if (selectedBool === questionObj.correct_answer) {
        isCorrect = true;
      }
      break;
    }
    default:
      console.error("Unknown question_type on submit:", questionObj.question_type);
      break;
  }

  // Award points if correct
  if (isCorrect) {
    feedbackEl.textContent = "Correct!";
    userPoints += questionObj.points;
  } else {
    feedbackEl.textContent = "Incorrect!";
    if (!isCorrect) {
      feedbackEl.textContent = "Incorrect!";
      highlightCorrectAnswers(questionObj);
    }
  }

  // Move to next question after 3 seconds
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.questions.length) {
      feedbackEl.textContent = "";
      showQuestion(currentQuestionIndex);
    } else {
      // Last question reached, show final results
      showFinalResults();
    }
  }, 3000);
}

/**
 * After all questions, fetch result.json and display the final message/image.
 */
async function showFinalResults() {
  // Hide question section
  document.getElementById("questionSection").style.display = "none";
  // Show final result section
  const finalResultEl = document.getElementById("finalResult");
  finalResultEl.style.display = "block";

  const percentage = Math.round((userPoints / totalPoints) * 100);

  try {
    const response = await fetch("https://localhost:5001/api/result");
    const resultData = await response.json();

    // Find the matching range for 'percentage'
    const matched = resultData.results.find(r =>
      percentage >= r.minpoints && percentage <= r.maxpoints
    );

    // Show the percentage
    document.getElementById("finalScore").textContent = percentage + "%";

    // Grab the elements for the final info
    const finalTitleEl = document.getElementById("finalTitle");
    const finalMessageEl = document.getElementById("finalMessage");
    const finalImageEl = document.getElementById("finalImage");

    if (matched) {
      finalTitleEl.textContent = matched.title;
      finalMessageEl.textContent = matched.message;
      finalImageEl.src = matched.img;
      finalImageEl.alt = matched.title;
    } else {
      finalTitleEl.textContent = "No result found!";
      finalMessageEl.textContent = "Your score did not match any range.";
      finalImageEl.src = "";
      finalImageEl.alt = "No result image";
    }
  } catch (err) {
    console.error("Error fetching result data:", err);
  }
}


/**********************************************
 * Utility functions
 **********************************************/

function sortNumeric(arr) {
  return arr.slice().sort((a, b) => a - b);
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

/**
 * Maps certain keywords to a background image URL.
 * You can store these images in 'wwwroot/images/' if desired.
 */
function getBackgroundForGame(questionTitle) {
  // Convert title to lowercase for easy matching
  const lowerTitle = questionTitle.toLowerCase();

  if (lowerTitle.includes("monopoly")) {
    return "url('../images/monopoly-bg.jpg')";
  } else if (lowerTitle.includes("risk")) {
    return "url('../images/risk-bg.jpg')";
  } else if (lowerTitle.includes("scrabble")) {
    return "url('../images/scrabble-bg.jpg')";
  } else if (lowerTitle.includes("chess")) {
    return "url('../images/chess-bg.jpg')";
  } else if (lowerTitle.includes("jenga")) {
    return "url('../images/jenga-bg.jpg')";
  } else if (lowerTitle.includes("dungeons and dragons") || lowerTitle.includes("d&d")) {
    return "url('../images/dnd-bg.jpg')";
  } else if (lowerTitle.includes("backgammon")) {
    return "url('../images/backgammon-bg.jpg')";
  } else if (lowerTitle.includes("trivial pursuit")) {
    return "url('../images/trivialpursuit-bg.jpg')";
  }

  // Default fallback if no keywords matched
  return "url('../images/login.png')";
}

function highlightCorrectAnswers(questionObj) {
  const answersList = document.querySelectorAll("#answersList li");

  // Convert the correct_answer into an array for consistent handling
  let correctArray = Array.isArray(questionObj.correct_answer)
    ? questionObj.correct_answer
    : [questionObj.correct_answer];

  answersList.forEach(li => {
    const inputEl = li.querySelector("input");

    let answerVal;
    if (questionObj.question_type === "truefalse") {
      // For true/false, correct_answer is boolean
      // So we interpret the input value as a boolean
      answerVal = (inputEl.value === "true");
    } else {
      // For multiplechoice or single, parse integer ID
      answerVal = parseInt(inputEl.value, 10);
    }

    // If the answerVal is in the correct array, highlight green; else red
    if (correctArray.includes(answerVal)) {
      li.style.color = "green";
    } else {
      li.style.color = "red";
    }
  });
}

