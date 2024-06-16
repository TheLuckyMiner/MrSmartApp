const questions = [ 	{ 		question: "Tom's favorite sport is …", 		answers: ["football", "music", "drawing"], 		correct: 1, 	}, 	{ 		question: "The children … at Maths.", 		answers: ["jump", "cook", "count"], 		correct: 3, 	}, 	{ 		question: "… books are very interesting.", 		answers: ["these", "that", "this"], 		correct: 1, 	}, 	{ 		question: "… cat is not mine.", 		answers: ["those", "these", "that"], 		correct: 3, 	}, 	{ 		question: "There are a lot of berries … the forest.", 		answers: ["between", "among", "in"], 		correct: 3, 	}, 	{ 		question: "His father … got a new laptop.", 		answers: ["have", "has", "is"], 		correct: 2, 	}, 	{ 		question: "Does your sister … TV every evening?", 		answers: ["watch", "see", "look"], 		correct: 1, 	}, 	{ 		question: "It's … cold today to walk in the park.", 		answers: ["very", "too", "enough"], 		correct: 2, 	}, 	{ 		question: "Do they have … work to do today?", 		answers: ["many", "a lot of", "some"], 		correct: 2, 	}, 	{ 		question: "Lima enjoys … very much", 		answers: ["to dance", "dancing", "dance"], 		correct: 2, 	} ];
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
		message = 'Вы ответили верно на все вопросы!';
	} else if(score * 100 / questions.length > 50){
		title = 'Неплохой результат';
		message = 'Больше половины правильных ответов';
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
	console.log(userAnswers);
	submitBtn.blur();
	submitBtn.addEventListener('click', () => {
		showAnswers();
		if(score * 100 / questions.length > 50){
			submitBtn.classList.toggle('btn-disabled');
			const finishBtn = document.querySelector('#finish');
			finishBtn.classList.toggle('btn-disabled');
		} else{
			submitBtn.innerText = 'Вернуться на главную страницу';
			submitBtn.onclick = () => window.location='/tests';
		}
   })	
};