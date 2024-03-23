const questions = [ 	{ 		question: " Вставьте пропущенное слово: They ... two brothers.", 		answers: ["have got", "has got", "has gotted"], 		correct: 1, 	}, 	{ 		question: "Дайте правильные ответы на вопросы. Have you got a wigwam?", 		answers: ["No, he hasn`t", "No, I haven`t", "No, they hasnt"], 		correct: 2, 	}, 	{ 		question: "Вставьте пропущенное слово: Mike and Helen ... many friends.", 		answers: ["had get", "has got", "have got"], 		correct: 3, 	}, 	{ 		question: "Вставьте пропущенное слово:My friend ... a nice boat.", 		answers: ["had gotted", "has got", "have got"], 		correct: 2, 	}, 	{ 		question: "Выберите вопрос:_ ...? No, she hasn`t. She has got a cat.", 		answers: ["Has Helen got a rabbit?", "Has Mike got a cat?", "Have brothers got a dog?"], 		correct: 1, 	}, ];

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
	submitBtn.innerText = 'Вернуться на главную страницу';
	submitBtn.onclick = () => window.location='/tests';

}