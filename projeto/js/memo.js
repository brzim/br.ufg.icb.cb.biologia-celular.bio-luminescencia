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
		corrects = corrects + 1;
		score += POINT_GAME_COR;
		if (corrects == TOTAL_CORRECT) {
			alert("Fim de Jogo! Sua pontuação foi " + score);
		}
	}

	this.decrementScore = function () {
		score -= POINT_GAME_INC;
	}
}

function Card(picture) {
	var FOLDER_ASK_IMAGE = 'image/cards/quest/'
	var FOLDER_ANS_IMAGE = 'image/cards/answer/'
	var IMAGE_QUESTION = "question.svg"
	this.type = ""
	this.picture = picture;
	this.visible = false;
	this.block = false;

	this.equals = function (cardGame) {
		if (this.picture.valueOf() == cardGame.picture.valueOf() && this.type != cardGame.type) {
			return true;
		}
		return false;
	}
	this.getPathCardAskImage = function () {
		return FOLDER_ASK_IMAGE + picture;
	}
	this.getPathCardAnsImage = function () {
		return FOLDER_ANS_IMAGE + picture;
	}
	this.getQuestionImage = function () {
		return FOLDER_ASK_IMAGE + IMAGE_QUESTION;
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
		if (!card.block && !block) {
			if (firstSelected == null) {
				firstSelected = card;
				card.visible = true;
			} else if (secondSelected == null && firstSelected != card) {
				secondSelected = card;
				card.visible = true;
			}

			if (firstSelected != null && secondSelected != null) {
				block = true;
				var timer = setInterval(function () {
					if (secondSelected.equals(firstSelected)) {
						firstSelected.block = true;
						secondSelected.block = true;
						eventController["correct"]();
					} else {
						firstSelected.visible = false;
						secondSelected.visible = false;
						eventController["wrong"]();
					}
					firstSelected = null;
					secondSelected = null;
					clearInterval(timer);
					block = false;
					eventController["show"]();
				}, TIME_SLEEP_BETWEEN_INTERVAL);
			}
			eventController["show"]();
		};
	};

}

function CardGame(cards, controllerLogicGame, scoreBoard) {
	var LINES = 4;
	var COLS = 4;
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
				if (card.visible) {
					cardImage.setAttribute("src", card.getPathCardAskImage());
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
			}
			var br = document.createElement("br");
			game.appendChild(br);
		}
	}
}

function BuilderCardGame() {
	var ask_pictures = new Array('1.svg', '1.svg',
		'2.svg', '2.svg',
		'3.svg', '3.svg',
		'4.svg', '4.svg',
		'5.svg', '5.svg',
		'6.svg', '6.svg',
		'7.svg', '7.svg',
		'8.svg', '8.svg');

	var ans_pictures = new Array('1.svg', '1.svg',
		'2.svg', '2.svg',
		'3.svg', '3.svg',
		'4.svg', '4.svg',
		'5.svg', '5.svg',
		'6.svg', '6.svg',
		'7.svg', '7.svg',
		'8.svg', '8.svg');

	this.doCardGame = function () {
		shufflePictures();
		cards = buildCardGame();
		cardGame = new CardGame(cards, new ControllerLogicGame(), new ScoreBoardGameControl())
		cardGame.clear();
		return cardGame;
	}

	var shufflePictures = function () {
		var i = ask_pictures.length,
			j, tempi, tempj;
		if (i == 0) return false;
		while (--i) {
			j = Math.floor(Math.random() * (i + 1));
			tempi = ask_pictures[i];
			tempj = ask_pictures[j];
			ask_pictures[i] = tempj;
			ask_pictures[j] = tempi;
		}
	}

	var buildCardGame = function () {
		var countCards = 0;
		cards = new Array();
		for (var i = ask_pictures.length - 1; i >= 0; i--) {
			card = new Card(ask_pictures[i]);
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