import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the number of questions for the quiz
const numQuestions = 10;
let score = 0;
let currentQuestion = 1;
let timer;

// Generate a random number between min and max (inclusive)
function getRandomNumber() {
  return Math.round(Math.random() *10);
}

// Generate a random arithmetic question
function generateQuestion() {
  const num1 = getRandomNumber(); // Adjust the range based on difficulty level
  const num2 = getRandomNumber();
  const operator = getRandomNumber(1, 3); // 1: addition, 2: subtraction, 3: multiplication

  let question, answer;
  switch (operator) {
    case 1:
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
      break;
    case 2:
      question = `${num1} - ${num2}`;
      answer = num1 - num2;
      break;
    case 3:
      question = `${num1} * ${num2}`;
      answer = num1 * num2;
      break;
  }

  return { question, answer };
}

// Validate user's input
function validateInput(input) {
  return !isNaN(input) && Number.isInteger(parseFloat(input));
}

// Compare the student's answer with the correct answer
function checkAnswer(userAnswer, correctAnswer) {
  return parseInt(userAnswer) === correctAnswer;
}

// Prompt the student to enter their answer for each question
function askQuestion(question, callback) {
  rl.question(`Question ${currentQuestion}: ${question} = `, (answer) => {
    if (!validateInput(answer)) {
      console.log('Invalid input. Please enter a valid number.\n');
      askQuestion(question, callback);
    } else {
      callback(answer);
    }
  });
}

// Provide immediate feedback to the student (correct or incorrect)
function provideFeedback(isCorrect) {
  if (isCorrect) {
    console.log('Correct!\n');
    score++;
  } else {
    console.log('Incorrect!\n');
  }
}

// Create a hint feature
function provideHint(correctAnswer) {
  console.log(`Hint: The answer is ${correctAnswer}\n`);
}

// Update the student's score based on their answers
function updateScore() {
  console.log(`Your score: ${score}/${numQuestions}\n`);
}

// Randomize the order of the questions in the quiz
function shuffleQuestion(questions) {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

// Implement a timer for each question with a specified time limit
function startTimer(callback) {
  timer = setTimeout(() => {
    console.log('Time is up!\n');
    callback(null);
  }, 5000); // Adjust the time limit (in milliseconds) based on difficulty level
}

// Stop the timer
function stopTimer() {
  clearTimeout(timer);
}

// Main quiz function
function startQuiz() {
  console.log('Welcome to the Math Quiz!\n');
  const questions = [];

  // Generate random questions
  for (let i = 0; i < numQuestions; i++) {
    questions.push(generateQuestion());
  }

  // Randomize the order of questions
  shuffleQuestion(questions);

  // Prompt the student for each question
  function nextQuestion() {
    if (currentQuestion > numQuestions) {
      rl.close();
      return;
    }

    const { question, answer } = questions[currentQuestion - 1];
    console.log(`Question ${currentQuestion}: ${question}`);

    startTimer((userAnswer) => {
      stopTimer();
      if (userAnswer === null) {
        // User exceeded the time limit
        console.log('Question unanswered!\n');
        currentQuestion++;
        nextQuestion();
      }
    });

    askQuestion(question, (userAnswer) => {
      stopTimer();
      if (checkAnswer(userAnswer, answer)) {
        provideFeedback(true);
      } else {
        provideFeedback(false);
        provideHint(answer);
      }

      currentQuestion++;
      nextQuestion();
    });
  }

  nextQuestion();
}

// Start the quiz
startQuiz();
