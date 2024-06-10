const questions = [
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
		message = 'Вы прошли уровень Advanced на 100%';
	} else if(score * 100 / questions.length >= 60){
		title = 'Неплохой результат';
		message = 'Вы прошли уровень Advanced';
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
