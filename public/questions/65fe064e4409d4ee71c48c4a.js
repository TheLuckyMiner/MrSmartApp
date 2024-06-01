const questions = [ 	{ 		question: "Выберите личные местоимение, заменяющие слово apple", 		answers: ["it", "she", "whe", "you"], 		correct: 1, 	}, 	{ 		question: "Выберите личные местоимение, заменяющие слова Steve and Mary", 		answers: ["I", "he", "they", "it"], 		correct: 3, 	}, 	{ 		question: "Как на русский язык переводится слово They", 		answers: ["Он", "Мы", "Вы", "Они"], 		correct: 4, 	}, 	{ 		question: "This is my car. Do you like ...?", 		answers: ["him", "it", "her", "his"], 		correct: 2, 	}, 	{ 		question: "I never drink coffee. I hate ...", 		answers: ["them", "her", "it", "him"], 		correct: 1, 	}, ];

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