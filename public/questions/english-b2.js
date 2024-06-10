const questions = [
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
	}
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
		message = 'Вы прошли уровень Upper-Intermediate на 100%';
	} else if(score * 100 / questions.length >= 60){
		title = 'Неплохой результат';
		message = 'Вы прошли уровень Upper-Intermediate';
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
