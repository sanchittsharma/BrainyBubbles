
let questions=[];
fetch("Tech.json")
 .then(response => response.json())
    .then(data => {
        questions = data; // Store the fetched questions
        randomquestion(questions);
        loadquestions();
    })
    .catch(error => console.error("Error loading questions:", error));



function randomquestion(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}
// randomquestion(questions);

let index=0;
const que=document.getElementById("ques");
const alloptions=document.querySelectorAll(".optns")

const loadquestions=()=>{
    if(index>=1){
    setTimeout(() => {
        
        const data=questions[index];
        que.innerText=`${index+1}) ${data.question}`;
        alloptions[0].nextElementSibling.textContent=data.option1;
        alloptions[1].nextElementSibling.textContent=data.option2;
        alloptions[2].nextElementSibling.textContent=data.option3;
        alloptions[3].nextElementSibling.textContent=data.option4;
    }, 2000);
    
}
else{
    const data=questions[index];
    que.innerText=`${index+1}) ${data.question}`;
    alloptions[0].nextElementSibling.textContent=data.option1;
    alloptions[1].nextElementSibling.textContent=data.option2;
    alloptions[2].nextElementSibling.textContent=data.option3;
    alloptions[3].nextElementSibling.textContent=data.option4;
}
}


let correctsound=new Audio("correct.mp3")
correctsound.load();
let incorrectsound= new Audio("wrong.mp3");
incorrectsound.load();

let right=0,wrong=0;
// let total=questions.length;

// function to check correct answer
function checkanswer(){
   for (let input of alloptions)
{
    if (input.checked) {
        // console.log(input.value);
       let checkedinput=input.value;
        input.checked=false;
        return checkedinput; 
    } 
}
}
// function for leaderboard 
function showleaderboard() {
    // Hide everything else
    document.getElementById("home").classList.remove("active");
    // document.getElementById("quiz").classList.remove("active");

    // Show leaderboard
    document.getElementById("leaderboardmain").classList.add("active");
    document.getElementById("leaderboard").classList.add("active");
    console.log(right)
    
    document.getElementById("score").innerHTML=right
}
// function for submit button 
function submit(){   
    let ans = checkanswer();
    console.log(ans);
    if(ans==undefined)
        {  alert("select a ans")
            return
        }
    const data=questions[index];
  if(ans===data.correct){
        correctsound.play();
        right++;
        
    }
    else{
        incorrectsound.play();
        wrong++;
    }
    index++;
     if(index <=0 )
    {
    loadquestions()
    }
    else{
        showleaderboard();
    }
}

// const checkanswer=()=>