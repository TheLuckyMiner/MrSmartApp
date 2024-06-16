const questions = [ 	{ 		question: "I'm happy … it.", 		answers: ["to hear", "hear", "heard", "hearing"], 		correct: 1, 	}, 	{ 		question: "Everyone likes …", 		answers: ["help", "helping", "be helped", "to be helped"], 		correct: 4, 	}, 	{ 		question: "Sorry … you in such an uncomfortable situation.", 		answers: ["to placing", "to have placed", "placing", "to be placed"], 		correct: 2, 	}, 	{ 		question: "I'm so glad … with such a famous person.", 		answers: ["speaking", "to be spoken", "to be speaking", "being spoken"], 		correct: 3, 	}, 	{ 		question: "This boy seems … a lot.", 		answers: ["to read", "to be read", "reading", "read"], 		correct: 1, 	}, { 		question: "… to good music is a pleasure.", 		answers: ["Listen", "Listening", "Listened", "Being listening"], 		correct: 2, 	}, { 		question: "My car needs …", 		answers: ["reparing", "to repare", "be repaired", "repaired"], 		correct: 1, 	}, { 		question: "All children like … fairy-tales.", 		answers: ["tell", "be told", "being told", "be telling"], 		correct: 3, 	}, { 		question: "Excuse me for … your favorite cup.", 		answers: ["breaking", "break", "to break", "being breaking"], 		correct: 1, 	}, { 		question: "I don't mind … to the party.", 		answers: ["she come", "she coming", "her coming", "she to come"], 		correct: 3, 	} ];
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