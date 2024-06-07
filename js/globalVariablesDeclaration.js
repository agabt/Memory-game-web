// DOM variables (indicated with $etc)
const $gameControls = document.querySelector("#game-controls");
const $gameInfo = document.querySelector("#game-info");
const $gameBoard = document.querySelector("#game-board");
const $startGame = document.querySelector("#start-game");
const $resetGame = document.querySelector("#reset-game");
const $endGame = document.querySelector("#end-game");
const $heightInput = document.querySelector("#height");
const $widthInput = document.querySelector("#width");
const $dialog = document.querySelector("dialog");
const $dialogTitle = document.querySelector("#dialog-title");
const $dialogInfo = document.querySelector("#dialog-info");
const $playerScore = document.querySelector("#player-score");
const $aiScore = document.querySelector("#ai-score");
const $aiDifficulty = document.querySelector("#ai-difficulty");
const $aiDifficultyRange = document.querySelector("#ai-difficulty-range");
const $log = document.querySelector("#log");
const $timer = document.querySelector("#timer");
const $playerWonGames = document.querySelector("#player-won-games");
const $aiWonGames = document.querySelector("#ai-won-games");
const $aiDifficultyCheckbox = document.querySelector("#ai-difficulty-checkbox");
const $aiOptions = document.querySelector("#ai-options");
const $deleteLocalStorage = document.querySelector("#delete-local-storage");
const $closeDialog = document.querySelector("#close-dialog");

// Arrays
let openObjectCards = [];
let allObjectCards = [];
let aiKnownCards = new Set();
let cardFrontImages = [
    "bob-omb", "bowser-squeleton", "bowser", "bowsy", "brick-block", "cappy", "cloud", "coin",
    "daisy", "estela", "fire-flower", "goomba", "item-box", "koopa", "luigi-on-yoshi", "luigi",
    "mario-jumping", "mario-on-yoshi", "mushroom", "peach", "penguin", "petey-pirhana", "pirhana-plant", "queen-bee",
    "shy-guy", "star-mario", "star", "superstar", "toad", "wiggler", "yoshi-egg", "yoshi"
];

// Time Outs
let closeCardsTimeOut = null;
let checkWinTimeOut = null;
let changeTurnTimeOut = null;
let flipCardsTimeOut = null;
let flipCardsCloseTimeOut = null;
let aiTurnTimeOut = null;
let aiFlipRandomCardTimeOut = null;

// Intervals
let timeInterval = null;

// Game parameters
let gameHeight = 0;
let gameWidth = 0;

let flippedCards = 0;
let foundPairs = 0;
let cardIndex = -1;
let time = 0;

let whoseTurn = "player";
let aiDifficulty = 50;

let playerScore = 0;
let aiScore = 0;
let playedGames = 0;
let playerWonGames = localStorage.getItem("playerWonGames") || 0;
let aiWonGames = localStorage.getItem("aiWonGames") || 0;
let aiActivated = true;

// Reset variables
function resetVariables() {
    $gameBoard.innerHTML = "";
    clearTimeout(closeCardsTimeOut);
    clearTimeout(checkWinTimeOut);
    clearTimeout(changeTurnTimeOut);
    clearTimeout(flipCardsTimeOut);
    clearTimeout(flipCardsCloseTimeOut);
    clearTimeout(aiTurnTimeOut);
    clearTimeout(aiFlipRandomCardTimeOut);
    closeCardsTimeOut = null;
    flippedCards = 0;
    cardIndex = -1;
    foundPairs = 0;
    time = 0;
    clearInterval(timeInterval);
    $timer.textContent = "0:00";
    timeInterval = null;
    openObjectCards = [];
    allObjectCards = [];
    aiKnownCards = new Set();
    $gameBoard.classList.remove("ai-turn");
    whoseTurn = "player";
    playerScore = 0;
    aiScore = 0;
    updateScore();
}