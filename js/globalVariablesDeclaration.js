// DOM variables (indicated with $etc)
const $gameControls = document.querySelector("#game-controls");
const $gameInfo = document.querySelector("#game-info");
const $gameBoard = document.querySelector("#game-board");
const $startGame = document.querySelector("#start-game");
const $resetGame = document.querySelector("#reset-game");
const $heightInput = document.querySelector("#height");
const $widthInput = document.querySelector("#width");
const $dialog = document.querySelector("dialog");
const $dialogTitle = document.querySelector("#dialog-title");
const $dialogInfo = document.querySelector("#dialog-info");

// Arrays
let openObjectCards = [];
let allObjectCards = [];
let aiKnownCards = new Set();
let cardFrontImages = ["cloud", "fire-flower", "mushroom", "superstar"];

// Time Outs
let closeCardsTimeOut = null;
let checkWinTimeOut = null;
let changeTurnTimeOut = null;

// Game parameters
let gameHeight = 0;
let gameWidth = 0;

let flippedCards = 0;
let foundPairs = 0;
let cardIndex = -1;

let whoseTurn = "player";
let aiDifficulty = 100;

// Reset variables
function resetVariables() {
    $gameBoard.innerHTML = "";
    globalThis.clearTimeout(closeCardsTimeOut);
    closeCardsTimeOut = null;
    flippedCards = 0;
    cardIndex = -1;
    foundPairs = 0;
    openObjectCards = [];
    allObjectCards = [];
    aiKnownCards = new Set();
    $gameBoard.classList.remove("ai-turn");
    whoseTurn = "player";
}