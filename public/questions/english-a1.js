const questions = [
	{
		question: "Hello, I am John. And what’s your name?",
		answers: ["I Anna.", "My name Anna.", "I do Anna.", "I am Anna."],
		correct: 4,
	},
	{
		question: "- How old (...)? – I am twenty.",
		answers: ["have you", "you are", "do you", "are you"],
		correct: 4,
	},
	{
		question: "(...) you do?",
		answers: ["Who do", "What", "What does", "What do"],
		correct: 4,
	},
	{
		question: "My parents are rich. That’s (...) new house.",
		answers: ["our", "mine", "theirs", "ours"],
		correct: 1,
	},
	{
		question: "When (...) you start learning English?",
		answers: ["are", "did", "have", "were"],
		correct: 2,
	},
	{
		question: "The class (...) ten o’clock.",
		answers: ["start on", "starts at", "starts in", "start at"],
		correct: 2,
	},
	{
		question: "When I (...) 6, I (...) read and write.",
		answers: ["was, can", "was, could", "were, could", "am, can"],
		correct: 2,
	},
	{
		question: "I am sorry, my mother can’t answer the phone at the moment. She (...) a shower.",
		answers: ["is having", "has", "is has", "am having"],
		correct: 1,
	},
	{
		question: "She is (...) swimmer in our class. No one swims (...) than she does.",
		answers: ["the best, worse", "best, good", "the best, better", "very good, better"],
		correct: 3,
	},
	{
		question: "I (...) the film yet. I (...) to do it tonight.",
		answers: ["didn’t watch, am going", "didn’t watch, going", "haven’t watched, am going", "watched, am going"],
		correct: 3,
	},
	{
		question: "I usually travel (...) car. It (...) comfortable.",
		answers: ["by, -", "at, is", "on, is", "by, is"],
		correct: 4,
	},
	{
		question: "There (...) a table and two chairs in the kitchen.",
		answers: ["is", "-", "are", "does"],
		correct: 1,
	},
	{
		question: "-(...) you ever (...) your leg? -Yeah, once. -When (...) it (...)? -Three years ago.",
		answers: ["Did break, did happen", "Have break, has happened", "Did broke, did happened", "Have broken, did happen"],
		correct: 4,
	},
	{
		question: "Could you speak (...), please? I can’t understand you.",
		answers: ["more slower", "slowly", "faster", "slowlier"],
		correct: 2,
	},
	{
		question: "-(...) some tea? -No, thank you. -Why not? -Because I (...) tea.",
		answers: ["Do you like, don’t like", "Would you like, don’t like", "Would you like, wouldn’t like", "Do you like, like"],
		correct: 2,
	},
	{
		question: "We don’t eat (...) apples in our house. But there are (...) biscuits – my son adores them!",
		answers: ["much, a lot of", "many, much", "much, many", "many, a lot of"],
		correct: 4,
	},
	{
		question: "I work very hard. I don’t have (...) free time.",
		answers: ["many", "a", "much", "some"],
		correct: 3,
	},
	{
		question: "- What time (...)? - At 7.15. - And when (...)? - 15 minutes later.",
		answers: ["do you get up, do you wake up", "do you wake up, do you get up", "you wake up, you get up", "you get up, you wake up"],
		correct: 2,
	},
	{
		question: "(...) coffee do you drink?",
		answers: ["How", "How much", "How many", "A lot of"],
		correct: 2,
	},
	{
		question: "David is (...).",
		answers: ["boyfriend my sister", "my boyfriend’s sister", "my sister’s boyfriend", "my sisters boyfriend"],
		correct: 3,
	},
	{
		question: "- Can I help you? - No, thank you, I (...).",
		answers: ["am only going", "only seeing", "am only looking at", "am only looking"],
		correct: 4,
	},
	{
		question: "There isn’t much milk in the bottle. It’s practically (...).",
		answers: ["empty", "full", "clean", "wet"],
		correct: 1,
	},
	{
		question: "I am (...) in my family.",
		answers: ["taller", "the tall", "tall", "the tallest"],
		correct: 4,
	},
	{
		question: "(...) free time do you have during the week?",
		answers: ["-", "How much", "How many", "How lot of"],
		correct: 2,
	},
	{
		question: "It’s her birthday next week, but she (...) a party.",
		answers: ["isn’t going to have", "is going to have", "doesn’t have", "don’t have"],
		correct: 1,
	}
];

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
		message = 'Вы прошли уровень Elementary на 100%';
	} else if(score * 100 / questions.length >= 30){
		title = 'Неплохой результат';
		message = 'Вы прошли уровень Elementary';
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

	submitBtn.blur();
	
	if(score * 100 / questions.length >= 30){
		submitBtn.classList.toggle('btn-disabled');
		const finishBtn = document.querySelector('#finish');
		finishBtn.classList.toggle('btn-disabled');
	} else{
		submitBtn.innerText = 'Вернуться назад';
		submitBtn.onclick = () => window.location='/english-level';
	}
}