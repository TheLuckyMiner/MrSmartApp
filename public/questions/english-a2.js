const questions = [
	{
		question: "This is (...) interesting book. Have you read it?",
		answers: ["the", "-", "a", "an"],
		correct: 4,
	},
	{
		question: "(...) are you doing tonight?",
		answers: ["Who", "What", "where", "Why"],
		correct: 2,
	},
	{
		question: "My sister’s friend is (...) trained teacher.",
		answers: ["the", "–", "a", "an"],
		correct: 3,
	},
	{
		question: "This is the university (...) I studied economics.",
		answers: ["when", "where", "who", "why"],
		correct: 2,
	},
	{
		question: "I am thirsty. I just need (...) water.",
		answers: ["some", "any", "a few", "many"],
		correct: 1,
	},
	{
		question: "He has (...) money. He can’t spend it!",
		answers: ["too many", "enough", "too much", "too"],
		correct: 3,
	},
	{
		question: "Jane has (...) breakfast at six a.m.",
		answers: ["a", "the", "any", "-"],
		correct: 4,
	},
	{
		question: "How often (...) to the cinema?",
		answers: ["go you", "do you go", "you do go", "you go"],
		correct: 2,
	},
	{
		question: "I travelled to (...) London by train yesterday.",
		answers: ["the", "-", "a", "an"],
		correct: 2,
	},
	{
		question: "I (...) at the moment because I am on holiday.",
		answers: ["‘m not studying", "don’t study", "not study", "not studying"],
		correct: 1,
	},
	{
		question: "He walked (...) the café and ordered a coffee.",
		answers: ["out", "out of", "into", "in"],
		correct: 3,
	},
	{
		question: "Let’s go (...) home on foot.",
		answers: ["to", "at", "the", "-"],
		correct: 4,
	},
	{
		question: "He (...) to help his colleague with his work but it was too complicated.",
		answers: ["tryed", "tried", "tries", "tryes"],
		correct: 2,
	},
	{
		question: "She would like (...) to Romania on a business trip because her friend lives there.",
		answers: ["going", "come", "to go", "is going"],
		correct: 3,
	},
	{
		question: "You (...) swim there. It’s forbidden.",
		answers: ["don’t have to", "shouldn’t", "couldn’t", "mustn’t"],
		correct: 4,
	},
	{
		question: "How long (...) your dog?",
		answers: ["did you had", "had you", "have you had", "have you"],
		correct: 3,
	},
	{
		question: "My parents don’t let me (...) out during the week.",
		answers: ["go", "to go", "going", "to going"],
		correct: 1,
	},
	{
		question: "Ralph and Liz Miller (...) Russian for 10 years already.",
		answers: ["have been studying", "were studying", "are studying", "study"],
		correct: 1,
	},
	{
		question: "I (...) vegetables when I was a child.",
		answers: ["used not like", "did not liked", "did not use to like", "not used like"],
		correct: 3,
	},
	{
		question: "My mum doesn’t like (...) to work.",
		answers: ["drive", "to driving", "driving", "---"],
		correct: 3,
	},
	{
		question: "This is (...) meal I have ever had.",
		answers: ["a big", "a biggest", "the bigest", "the biggest"],
		correct: 4,
	},
	{
		question: "Linda (...) me she had finished her homework.",
		answers: ["replied", "said", "shouted", "told"],
		correct: 4,
	},
	{
		question: "I think you (...) lose some weight. You’ll feel much better.",
		answers: ["can", "should", "must to", "had to"],
		correct: 2,
	},
	{
		question: "What (...) when you opened the door?",
		answers: ["you see", "you saw", "did you see", "were you seeing"],
		correct: 3,
	},
	{
		question: "If she (...) home late, her mother will be angry.",
		answers: ["will get", "get", "gets", "got"],
		correct: 3,
	},
];

let userAnswers = [];
const headerContainer = document.querySelector('#header');
const listContainer = document.querySelector('#list');
const submitBtn = document.querySelector('#submit');

let score = 0;
let questionIndex = 0;

clearPage();
showQuestion();
submitBtn.onclick = checkAnswer;


function clearPage(){
	headerContainer.innerHTML = '';
	listContainer.innerHTML = '';
}

function showQuestion(){

	const headerTemplate = `<h2 class="title">%title%</h2>`;
	const title = headerTemplate.replace('%title%', questions[questionIndex]['question']);
	headerContainer.innerHTML = title;

	let answerNumber = 1;
	for (answerText of questions[questionIndex]['answers']){
		questionTemplate = `
		<li>
			<label>
				<input value="%number%" type="radio" class="answer" name="answer" />
				<span>%answer%</span>
			</label>
		</li>`;
		const answerHTML = questionTemplate
			.replace('%answer%', answerText)
			.replace('%number%', answerNumber);
		listContainer.innerHTML += answerHTML;
		answerNumber++;
	}
}

function checkAnswer(){
	const checkedRadio = listContainer.querySelector('input[type="radio"]:checked');
	if(!checkedRadio){
		submitBtn.blur();
		return
	}
	const userAnswer = parseInt(checkedRadio.value);
	userAnswers[questionIndex] = userAnswer;
	if(userAnswer === questions[questionIndex]['correct']){
		score++;
	}

	if(questions.length !== questionIndex + 1){
		questionIndex++;
		clearPage();
		showQuestion();
	} else{
		clearPage();
		showResults();
	}
}

function showAnswers(){
	clearPage();
	document.getElementById("quiz").style.minHeight = "600px";
	headerContainer.style.margin = "0";
	headerContainer.innerHTML = `<h2 class='title' style='text-align:center; margin-bottom: 2vh;'>Результаты</h2>`;
	for (let i = 0; i < questions.length; i++) {
		headerContainer.innerHTML += `<h3 class="title2" style="margin-bottom: 1vh; font-weight: 500">${i + 1}. ${questions[i]['question']}</h3>`;
		headerContainer.innerHTML += `<span class='userAnswer'>Правильный ответ: ${questions[i]['answers'][questions[i]['correct'] - 1]}</span><br>`;
		if (questions[i]['correct'] === userAnswers[i]){
			headerContainer.innerHTML += `<p class="correct userAnswer">Ваш ответ: ${questions[i]['answers'][userAnswers[i] - 1]}</p>`;
		} else{
			headerContainer.innerHTML += `<p class="incorrect userAnswer">Ваш ответ: ${questions[i]['answers'][userAnswers[i] - 1]}</p>`;
		}
	}
}

function showResults(){
	const resultsTemplate =`
		<h2 class="quiz__title">%title%</h2>
		<h3 class="quiz__summary">%message%</h3>
		<p class="quiz__result ">%result%</p>
		`;
	let title, message;
	if(score === questions.length){
		title = 'Поздравляем!';
		message = 'Вы прошли уровень Pre-Intermediate на 100%';
	} else if(score * 100 / questions.length >= 60){
		title = 'Неплохой результат';
		message = 'Вы прошли уровень Pre-Intermediate';
	} else{
		title = 'Попробуйте еще раз';
		message = 'Меньше половины правильных ответов';
	}

	let result = `${score} из ${questions.length}`
	const finalMessage = resultsTemplate
	.replace("%title%", title)
	.replace('%message%', message)
	.replace("%result%", result);

	headerContainer.innerHTML = finalMessage;
	submitBtn.innerText = "Узнать результаты";

	submitBtn.blur();
	submitBtn.addEventListener('click', () => {
		showAnswers();
		if(score * 100 / questions.length > 50){
			submitBtn.classList.toggle('btn-disabled');
			const finishBtn = document.querySelector('#finish');
			finishBtn.classList.toggle('btn-disabled');
		} else{
			submitBtn.innerText = 'Вернуться на главную страницу';
			submitBtn.onclick = () => window.location='/english-level';
		}
   })	
};