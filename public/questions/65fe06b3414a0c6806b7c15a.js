const questions = [ 	{ 		question: "Mary and Sue ... to the cinema.", 		answers: ["goes", "doesn't go", "don't go"], 		correct: 3, 	}, 	{ 		question: "She ... milk", 		answers: ["don't drink", "drinks", "drink"], 		correct: 2, 	}, 	{ 		question: "They ... orange juice.", 		answers: ["drinks", "doesn't drink", "drink"], 		correct: 3, 	}, 	{ 		question: "Mark ... English.", 		answers: ["speaks", "speak", "don't speak"], 		correct: 1, 	}, 	{ 		question: "My father ... TV.", 		answers: ["watches", "watch", "watchs"], 		correct: 1, 	}, ];

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

function showResults(){
	console.log(score);

	const resultsTemplate =`
		<h2 class="quiz__title">%title%</h2>
		<h3 class="quiz__summary">%message%</h3>
		<p class="quiz__result ">%result%</p>
		`;
	let title, message;
	if(score === questions.length){
		title = 'Поздравляем!';
		message = 'Вы ответили верно на все вопросы!';
	} else if(score * 100 / questions.length > 50){
		title = 'Неплохой результат';
		message = 'Больше половины правильных ответов';
	} else{
		title = 'Стоит постараться';
		message = 'Меньше половины правильных ответов';
	}

	let result = `${score} из ${questions.length}`
	const finalMessage = resultsTemplate
	.replace("%title%", title)
	.replace('%message%', message)
	.replace("%result%", result);

	headerContainer.innerHTML = finalMessage;

	submitBtn.blur();
	if(score * 100 / questions.length > 50){
		submitBtn.classList.toggle('btn-disabled');
		const finishBtn = document.querySelector('#finish');
		finishBtn.classList.toggle('btn-disabled');
	} else{
		submitBtn.innerText = 'Вернуться на главную страницу';
		submitBtn.onclick = () => window.location='/tests';
	}

}