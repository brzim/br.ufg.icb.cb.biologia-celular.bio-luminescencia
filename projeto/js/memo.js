var selectedCard, selectedQuestionId = -1,
	selectedAnswerId = -1;

function ScoreBoardGameControl() {
	var score = 0;
	// correct point
	var POINT_GAME_COR = 10;
	// incorrect point
	var POINT_GAME_INC = 5;
	var TEXT_SCORE = "Pontuação: "

	var TOTAL_CORRECT = 10;
	var corrects = 0;

	this.updateScore = function () {
		var scoreDiv = document.getElementById("score");
		scoreDiv.innerHTML = TEXT_SCORE + score;
	}

	this.incrementScore = function () {
		corrects++;
		score += POINT_GAME_COR;
		if (corrects == TOTAL_CORRECT) {
			alert("Fim de Jogo! Sua pontuação foi " + score);
		}
	}

	this.decrementScore = function () {
		score -= POINT_GAME_INC;
	}
}

function Card(picture, id) {
	var FOLDER_IMAGES = 'image/cards/quest/'
	var IMAGE_QUESTION = "question.png"
	this.picture = picture;
	this.visible = false;
	this.block = false;
	this.id = id;

	this.equals = function (cardGame) {
		if (this.picture.valueOf() == cardGame.picture.valueOf()) {
			return true;
		}
		return false;
	}
	this.getPathCardImage = function () {
		return FOLDER_IMAGES + picture;
	}
	this.getQuestionImage = function () {
		return FOLDER_IMAGES + IMAGE_QUESTION;
	}
}


function ControllerLogicGame() {
	var firstSelected;
	var secondSelected;
	var block = false;
	var TIME_SLEEP_BETWEEN_INTERVAL = 1000;
	var eventController = this;

	this.addEventListener = function (eventName, callback) {
		eventController[eventName] = callback;
	};

	this.doLogicGame = function (card, callback) {
		console.log(card);
		// Nada Selecionado, se não confere se a resposta selecionada 
		// é da pergunta que acabou de selecionar
		selectedQuestionId = card.id;
		selectedCard = card;
		console.log(card.getPathCardImage());
		document.querySelector('img[card-id="' + card.id + '"]').setAttribute('src', card.getPathCardImage());
		if (selectedAnswerId !== -1) {
			if (selectedAnswerId === selectedQuestionId) {
				selectedQuestionId = -1;
				selectedAnswerId = -1;
				eventController["correct"]();
				card.visible = true;
				card.block = true;
				setTimeout(function () {
					eventController["show"]();
				}, TIME_SLEEP_BETWEEN_INTERVAL);
			} else {
				document.querySelector('img[card-id="' + selectedCard.id + '"]').setAttribute('src', selectedCard.getQuestionImage());
			}

			selectedQuestionId = -1;
			selectedAnswerId = -1
		}

		// comentei pq não vou usar isso aqui mas vou deixar caso vc precise

		// if (!card.block && !block) {
		// 	if (firstSelected == null) {
		// 		firstSelected = card;
		// 		card.visible = true;
		// 	} else if (secondSelected == null && firstSelected != card) {
		// 		secondSelected = card;
		// 		card.visible = true;
		// 	}

		// 	if (firstSelected != null && secondSelected != null) {
		// 		block = true;
		// 		var timer = setInterval(function () {
		// 			if (secondSelected.equals(firstSelected)) {
		// 				firstSelected.block = true;
		// 				secondSelected.block = true;
		// 				eventController["correct"]();
		// 			} else {
		// 				firstSelected.visible = false;
		// 				secondSelected.visible = false;
		// 				eventController["wrong"]();
		// 			}
		// 			firstSelected = null;
		// 			secondSelected = null;
		// 			clearInterval(timer);
		// 			block = false;
		// 			eventController["show"]();
		// 		}, TIME_SLEEP_BETWEEN_INTERVAL);
		// 	}
		// 	eventController["show"]();
		// };
	};

}

function CardGame(cards, controllerLogicGame, scoreBoard, answers) {
	var LINES = 3;
	var COLS = 3;
	this.cards = cards;
	var logicGame = controllerLogicGame;
	var scoreBoardGameControl = scoreBoard;

	this.clear = function () {
		var game = document.getElementById("game");
		game.innerHTML = '';
	}

	this.show = function () {
		this.clear();
		scoreBoardGameControl.updateScore();
		var cardCount = 0;
		var game = document.getElementById("game");
		for (var i = 0; i < LINES; i++) {
			for (var j = 0; j < COLS; j++) {
				card = cards[cardCount++];
				var cardImage = document.createElement("img");
				cardImage.setAttribute('card-id', card.id);
				cardImage.className = "question";
				if (card.visible) {
					cardImage.setAttribute("src", card.getPathCardImage());
				} else {
					cardImage.setAttribute("src", card.getQuestionImage());
				}
				cardImage.onclick = (function (position, cardGame) {
					return function () {
						card = cards[position];
						var callback = function () {
							cardGame.show();
						};
						logicGame.addEventListener("correct", function () {
							scoreBoardGameControl.incrementScore();
							scoreBoardGameControl.updateScore();
						});
						logicGame.addEventListener("wrong", function () {
							scoreBoardGameControl.decrementScore();
							scoreBoardGameControl.updateScore();
						});

						logicGame.addEventListener("show", function () {
							cardGame.show();
						});

						logicGame.doLogicGame(card);

					};
				})(cardCount - 1, this);

				game.appendChild(cardImage);
				var br = document.createElement("br");
				game.appendChild(br);
			}
		}

		var answersDiv = document.getElementById("answers");
		if (answersDiv.children.length === 0) {
			for (var x = 0; x < answers.length; x++) {
				var answer = answers[x];
				var answerSpan = document.createElement("span");
				answerSpan.className = "answer";
				answerSpan.innerText = answer.value;
				answerSpan.setAttribute('question-id', answer.questionId);
				answersDiv.appendChild(answerSpan);
				answersDiv.onclick = function (event) {
					selectedAnswerId = parseInt(event.target.getAttribute('question-id'));
					if (selectedQuestionId !== -1) {
						if (selectedAnswerId === selectedQuestionId) {
							card.visible = true;
							card.block = true;
							document.querySelector('span[question-id="' + card.id + '"]').className = "answer active";
							document.querySelector('img[card-id="' + card.id + '"]').setAttribute('src', card.getPathCardImage());
						} else {
							document.querySelector('img[card-id="' + card.id + '"]').setAttribute('src', card.getQuestionImage());
						}

						selectedQuestionId = -1;
						selectedAnswerId = -1

					}
				}
			}
		}
	}
}

function BuilderCardGame() {
	var pictures = new Array('1.png', '1.png',
		'2.png', '2.png',
		'3.png', '3.png',
		'4.png', '4.png',
		'5.png', '5.png',
		'6.png', '6.png',
		'7.png', '7.png',
		'8.png', '8.png',
		'9.png', '9.png');

	// Arrays tem 2 formas de serem inicializados tanto como em cima quanto embaixo
	var answers = [{
			questionId: 1,
			value: 'Resposta 1'
		},
		{
			questionId: 2,
			value: 'Resposta 2'
		},
		{
			questionId: 3,
			value: 'Resposta 3'
		},
		{
			questionId: 4,
			value: 'Resposta 4'
		},
		{
			questionId: 5,
			value: 'Resposta 5'
		},
		{
			questionId: 6,
			value: 'Resposta 6'
		},
		{
			questionId: 7,
			value: 'Resposta 7'
		},
		{
			questionId: 8,
			value: 'Resposta 8'
		},
		{
			questionId: 9,
			value: 'Resposta 9'
		}
	];

	this.doCardGame = function () {
		shufflePictures();
		cards = buildCardGame();
		cardGame = new CardGame(cards, new ControllerLogicGame(), new ScoreBoardGameControl(), answers)
		cardGame.clear();
		return cardGame;
	}

	var shufflePictures = function () {
		var i = pictures.length,
			j, tempi, tempj;
		if (i == 0) return false;
		while (--i) {
			j = Math.floor(Math.random() * (i + 1));
			tempi = pictures[i];
			tempj = pictures[j];
			pictures[i] = tempj;
			pictures[j] = tempi;
		}
	}

	var buildCardGame = function () {
		var countCards = 0;
		cards = new Array();
		for (var i = pictures.length - 1; i >= 0; i--) {
			card = new Card(pictures[i], i + 1);
			cards[countCards++] = card;
		};
		return cards;
	}
}

function GameControl() {

}

GameControl.createGame = function () {
	var builderCardGame = new BuilderCardGame();
	cardGame = builderCardGame.doCardGame();
	cardGame.show();
}