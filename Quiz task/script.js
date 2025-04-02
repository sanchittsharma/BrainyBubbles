// localStorage.clear()

function registerUser() {
  // Get user input values
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  // Check if inputs are empty
  if (!username || !password) {
      alert("Please enter both username and password.");
      return;
  }

  // Retrieve existing users or initialize an empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if the username already exists
  let existingUser = users.find(user => user.username === username);
  if (existingUser) {
      alert("Username already exists! Please choose another one.");
      return;
  }
  // Create user object
  const newUser = {
      username: username,
      password: password  // Note: In a real application, never store plain text passwords!
  };
  // Add new user to the array
  users.push(newUser);

  // Save updated user data in localStorage
  localStorage.setItem("users", JSON.stringify(users));

  alert("User registered successfully!");
  storedUsername=username;
  // Optionally, you can clear the input fields after registration
  document.getElementById("username").value = '';
  document.getElementById("password").value = '';
  document.getElementById("loginpage").classList.remove("active");
  document.querySelector(".loginbox").classList.remove("active");
  document.getElementById("main").classList.add("active");
}
let storedUsername;
function login() {
  // Get user input values
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  // Check if inputs are empty
  if (!username || !password) {
      alert("Please enter both username and password.");
      return;
  }

  // Retrieve existing users from localStorage
  let rawData = localStorage.getItem("users");
  let users = rawData ? JSON.parse(rawData) : [];

  // Check if the user exists and the password matches
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
      alert("Login successful!");
      // You can redirect the user to another page or show main content
      // For example:
      storedUsername=username;
      document.getElementById("loginpage").classList.remove("active");
      document.querySelector(".loginbox").classList.remove("active");
      document.getElementById("main").classList.add("active");
  } else {
      alert("Invalid username or password.");
  }

  // Clear input fields after login attempt
  document.getElementById("username").value = '';
  document.getElementById("password").value = '';
}


let selectedCategory = "";
let questions = [];
// function to start quiz
function quizbtn() {
  let username = document.getElementById("username").value;
  let quizcategory = document.querySelector("input[name='type']:checked");
  if (quizcategory ) {
    localStorage.setItem("username", username);
    selectedCategory = quizcategory.value;
    // adding active class
    document.getElementById("main").classList.remove("active");
    document.getElementById("quiz").classList.add("active");
    document.getElementById("box").classList.add("active");
    // fetching json according to category
    fetch(selectedCategory + ".json")
      .then((response) => response.json())
      .then((data) => {
        questions = data; // Store the fetched questions
        randomquestion(questions);
        loadquestions();
      })
      .catch((error) => console.error("Error loading questions:", error));

    return questions;
  } else if (!quizcategory) {
    alert("Select the category");
  } else {
    alert("enter username");
  }
}
function randomquestion(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

let index = 0;
const que = document.getElementById("ques");
const alloptions = document.querySelectorAll(".optns");
// function to load questions
const loadquestions = () => {
  if (index >= 1) {
    setTimeout(() => {
      const data = questions[index];
      que.innerText = `${index + 1}) ${data.question}`;
      alloptions[0].nextElementSibling.textContent = data.option1;
      alloptions[1].nextElementSibling.textContent = data.option2;
      alloptions[2].nextElementSibling.textContent = data.option3;
      alloptions[3].nextElementSibling.textContent = data.option4;
    }, 1500);
    timestarts();
  } else {
    const data = questions[index];
    que.innerText = `${index + 1}) ${data.question}`;
    alloptions[0].nextElementSibling.textContent = data.option1;
    alloptions[1].nextElementSibling.textContent = data.option2;
    alloptions[2].nextElementSibling.textContent = data.option3;
    alloptions[3].nextElementSibling.textContent = data.option4;
    timestarts();
  }
};

let correctsound = new Audio("correct.mp3");
correctsound.load();
let incorrectsound = new Audio("wrong.mp3");
incorrectsound.load();
let right = 0,
  wrong = 0;
// function to check correct answer
function checkanswer(checkedinput) {
  const data = questions[index];
  let answer = checkedinput;
  let wronginput = document.querySelector(`input[value="${data.correct}"]`).id;
  let rightlabel=document.querySelector(`label[for="${wronginput}"]`);
  let input;
  let label;
  if(answer!==undefined){
 input = document.querySelector(`input[value="${answer}"]`).id;
  label = document.querySelector(`label[for="${input}"]`);
  
  }
  if (answer == undefined) {
    incorrectsound.play();
    rightlabel.style.backgroundColor = "#1E88E5";
    wrong++;
    
  }
  if (answer === data.correct) {
    label.style.backgroundColor = "#1E88E5";
    correctsound.play();
    right++;
  } else {
    if(answer!==undefined){
      incorrectsound.play();
    label.style.backgroundColor = "red";
    rightlabel.style.backgroundColor = "#1E88E5";
    
    
    
    wrong++;
    }
  }
  index++;
  if (index <= 9) {
    loadquestions();
    setTimeout(() => {
      
      
      rightlabel.style.backgroundColor = "#2E7D32";
    }, 1500);
    if(answer!==undefined){
    setTimeout(() => {
      
      label.style.backgroundColor = "#2E7D32";
      rightlabel.style.backgroundColor = "#2E7D32";
    }, 1200);
  }
  } else {
    
    showleaderboard();
  }
}
// function for leaderboard
function showleaderboard() {
  let accuracy = (right / 10) * 100;
  // let storedUsername = document.getElementById("username").value;
   let now = new Date();
    let formattedDate = now.toLocaleDateString(); // "4/1/2025"
    let formattedTime = now.toLocaleTimeString();
  saveScore(storedUsername, selectedCategory, right ,formattedDate,formattedTime);
  document.getElementById("quiz").classList.remove("active");
  document.getElementById("box").classList.remove("active");
  document.getElementById("leaderboard").classList.add("active");
  document.getElementById("leaderboardcontainer").classList.add("active");
  document.getElementById(
    "userpara"
  ).innerHTML = ` hey ! ${storedUsername} your score is ${right} and your accuracy is ${accuracy}%`;
  
  generateScoreTable();
}
// function for submit button
function submit() {
  clearInterval(timer);
  let checkedinput;
  for (let input of alloptions) {
    if (input.checked) {
      // console.log(input.value);
      checkedinput = input.value;
      input.checked = false;
      //   return checkedinput;
    }
  }
  let ans = checkanswer(checkedinput);
}
// timer for each question
let timer;
function timestarts() {
  let remainingtime = 35;
  let timeelement = document.getElementById("time");
  timeelement.textContent = remainingtime;
  clearInterval(timer);
  timer = setInterval(() => {
    remainingtime--;
    timeelement.textContent = `time left ${remainingtime} sec`;
    if (remainingtime <= 5) {
      timeelement.style.color = "red";
    }
    if (remainingtime <= 0) {
      clearInterval(timer);
      submit();
    }
  }, 1000);
}

// hints
let hint = 2;
function hints() {
  if (hint > 0) {
    hint--;
    document.getElementById("hint").textContent = `💡Hints remaining ${hint}`;
    alert(questions[index].hint);
  } else {
    alert(" Sorry! You have used this power");
  }
}

function saveScore(username, category, score,formattedDate,formattedTime) {
   
  if (!username || !category || score === undefined) {
    console.error("Error: Username, category, or score is missing.");
    return;
  }
  // Retrieve existing scores or create an empty array if none exist
  let scores = JSON.parse(localStorage.getItem("quizScores")) || [];
  // Add the new score 
  scores.push({ username, category, score,formattedDate,formattedTime });
  // Sort scores in descending order 
  scores.sort((a, b) => b.score - a.score);
  // Save back to localStorage
  localStorage.setItem("quizScores", JSON.stringify(scores));

  console.log("Scores saved:", scores);
}

function generateScoreTable() {
  let scores = JSON.parse(localStorage.getItem("quizScores")) || [];
  let username = document.getElementById("username").value;
  let accuracy = (right / 10) * 100 + "%"
  
  let tableHTML = `<table border="1" class="table table-striped table-hover bg-info-subtle w-100">
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Category</th>
                            <th>Score</th>
                            <th>Accuracy</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>`;

  scores.forEach((entry, index) => {
    tableHTML += `   <tr>
                        <td id="rank">${index + 1}</td>
                        <td id="name">${entry.username}</td>
                        <td id="">${entry.category}</td>
                        <td id="Category">${entry.score}</td>
                        <td id="accuracy">${accuracy}</td>
                        <td id="date">${entry.formattedDate}</td>
                        <td id="time">${entry.formattedTime}</td>
                      </tr>`;
  });

  document.getElementById("datatable").innerHTML = tableHTML;
}

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false; // Stop listening after one phrase
recognition.lang = "en-US"; // Set language
recognition.interimResults = false; // Get final results only
recognition.maxAlternatives = 1; // Best matching alternative

let userSpokenAnswer = ""; // Variable to store user's spoken answer
function convertSpokenOption(spokenText) {
  // Normalize spoken text (remove spaces and convert to lowercase)
  spokenText = spokenText.toLowerCase().trim();

  // Mapping spoken words to option keys
  let optionMap = {
    "option one": "option1",
    "option 1": "option1",
    "first option": "option1",
    "option first": "option1",
    "first": "option1",

    "option two": "option2",
    "option 2": "option2",
    "second option": "option2",
    "option second": "option2",
    "second": "option2",

    "option three": "option3",
    "option 3": "option3",
    "third option": "option3",
    "option third": "option3",
    "third": "option3",

    "option four": "option4",
    "option 4": "option4",
    "fourth option": "option4",
    "option fourth": "option4",
    "fourth": "option4",
  };
  return optionMap[spokenText] || "";
}
// function to answer by voice 
function listenForAnswer() {
  recognition.start();

  recognition.onresult = function (event) {
    let transcript = event.results[0][0].transcript.toLowerCase().trim(); // Capture spoken text
    console.log("User said:", transcript);
    userSpokenAnswer = transcript; // Store answer in variable
    let spokenanswer = convertSpokenOption(userSpokenAnswer);
    // Automatically check the answer
    checkanswer(spokenanswer);
  };

  recognition.onerror = function (event) {
    console.error("Speech Recognition Error:", event.error);
    alert("Could not recognize your voice. Try again.");
  };
}
document.getElementById("voiceAnswerBtn").addEventListener("click", listenForAnswer);

const toggleButton = document.getElementById("theme-toggle");
const body = document.body;

toggleButton.addEventListener("click", () => {
  // Toggle dark mode class on the body element
  body.classList.toggle("dark-mode");
});

