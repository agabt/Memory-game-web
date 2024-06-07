function flipCard(cardObject) {
    if (cardObject === undefined) {
        return;
    }

    const percentageOfProbabilityForAiToRemeber = Math.random() * 100;
    if (percentageOfProbabilityForAiToRemeber < aiDifficulty) {
        aiKnownCards.add(cardObject);
    }

    if (!(cardObject.cardElement.classList.contains("not-flipped"))) {
        return;
    }

    if (flippedCards >= 2) {
        return;
    }

    openObjectCards.push(cardObject);
    flippedCards++;

    cardObject.cardElement.classList.add("flipping-open");
    cardObject.cardElement.classList.remove("not-flipped");

    setTimeout(() => {
        cardObject.cardElement.classList.remove("flipping-open");
        cardObject.cardElement.classList.add("flipped");
    }, 800);

    if (flippedCards >= 2) {
        closeCardsTimeOut = setTimeout(() => {
            flipCardsClose();
        }, 2000);

        checkIfPair();
    }
}

function flipCardsClose() {
    openObjectCards.forEach(cardObjectOpen => {
        cardObjectOpen.cardElement.classList.add("flipping-close");
        cardObjectOpen.cardElement.classList.remove("flipped");

        setTimeout(() => {
            cardObjectOpen.cardElement.classList.remove("flipping-close");
            cardObjectOpen.cardElement.classList.add("not-flipped");
        }, 500);
    });

    flippedCards = 0;
    openObjectCards = [];
}

function checkIfPair() {
    console.log(openObjectCards);
    const [cardObject1, cardObject2] = openObjectCards;
    clearTimeout(changeTurnTimeOut);
    changeTurnTimeOut = null;

    if (cardObject1.index === cardObject2.index) {
        if (whoseTurn === "player") {
            addLog("El jugador humano ha encontrado un par.", "lightblue");
            playerScore++;
        } else {
            addLog("La IA ha encontrado un par.", "coral");
            aiScore++;
        }

        updateScore();

        foundPairs++;
        clearTimeout(closeCardsTimeOut);
        closeCardsTimeOut = null;

        flippedCards = 0;
        openObjectCards = [];

        setTimeout(() => {
            vanishAndDeleteCards(cardObject1, cardObject2);
        }, 1000);

        clearTimeout(checkWinTimeOut);

        checkWinTimeOut = setTimeout(() => {
            if (foundPairs == cardIndex + 1) {
                showEnding();
            }

        }, 1750);

        return;
    }

    changeTurnTimeOut = setTimeout(() => {
        changeTurn();
    }, 2000);
}

function showEnding() {
    if (playerScore > aiScore) {
        openDialog("¡Has ganado!", "Has encontrado todas las cartas.");
        addLog("El jugador humano ha ganado.", "green");
        playerWonGames++;
        localStorage.setItem("playerWonGames", playerWonGames);

    } else if (playerScore < aiScore) {
        openDialog("¡Has perdido!", "La IA ha encontrado más cartas que tú.");
        addLog("La IA ha ganado.", "red");
        aiWonGames++;
        localStorage.setItem("aiWonGames", aiWonGames);
    } else {
        openDialog("¡Empate!", "Has encontrado la misma cantidad de cartas que la IA.");
        addLog("Empate.");
    }

    endGame();
}

function addLog(message, color = "black") {
    const $logItem = document.createElement("p");
    $logItem.innerHTML = `Partida ${playedGames} - ${formatTime()} - ${message}`;
    $logItem.style.color = color;
    $log.appendChild($logItem);
}

function vanishAndDeleteCards(cardObject1, cardObject2) {
    cardObject1.cardElement.classList.add("found");
    cardObject2.cardElement.classList.add("found");

    removeCardFromAllObjectCards(cardObject1, cardObject2);
    removeCardFromAiKnownCards(cardObject1, cardObject2);
}

function updateScore() {
    $aiScore.innerHTML = aiScore;
    $playerScore.innerHTML = playerScore;
}

function removeCardFromAllObjectCards(...cards) {
    cards.forEach(card => {
        const cardIndex = allObjectCards.indexOf(card);
        if (cardIndex > -1) {
            allObjectCards.splice(cardIndex, 1);
        }
    });
}

function removeCardFromAiKnownCards(...cards) {
    cards.forEach(card => {
        aiKnownCards.delete(card);
    });
}

function changeTurn() {
    whoseTurn = whoseTurn === "player" ? "ai" : "player";
    $gameBoard.classList.toggle("ai-turn");

    if (whoseTurn === "ai") {
        aiTurn();
    }
}

function aiTurn() {
    if (whoseTurn === "player") {
        return;
    }

    if (aiKnownCards.size >= 2) {
        handlePairs();
        return;
    }

    aiFlipRandomCard();
}

function aiFlipRandomCard() {
    const randomCard = Math.floor(Math.random() * allObjectCards.length);
    const cardObject = allObjectCards[randomCard];
    if (openObjectCards.includes(cardObject)) {
        aiFlipRandomCard();
        return;
    }

    flipCard(cardObject);

    if (flippedCards >= 2) {
        return;
    }

    aiTurnTimeOut = setTimeout(() => {
        aiTurn();
    }, 1000);
}

function handlePairs() {
    checkedPairs = [];

    let iterationNumber = -1;
    aiKnownCards.forEach((card1) => {
        iterationNumber++;
        let iterationNumber2 = -1;

        aiKnownCards.forEach((card2, j) => {
            iterationNumber2++;

            if (iterationNumber >= iterationNumber2) {
                return;
            }

            if (card1.index === card2.index) {
                checkedPairs.push(card1, card2);
            }
        });

    });

    if (checkedPairs.length > 0) {
        checkedPairs.forEach((cardToFlip, index) => {
            const TIME_OUT = 500 * index;

            setTimeout(() => {
                flipCard(cardToFlip);
            }, TIME_OUT);
        });

    }

    aiFlipRandomCardTimeOut = setTimeout(() => {
        aiFlipRandomCard();
    }, checkedPairs.length * 500 + 1000);
}

$endGame.addEventListener("click", () => {
    endGame();
});

function endGame() {
    $aiDifficulty.classList.remove("untoachable");
    $aiDifficultyRange.classList.remove("untoachable");

    displayWonGames();

    clearInterval(timeInterval);
    timeInterval = null;

    $gameBoard.classList.remove("ai-turn");
    $gameBoard.classList.add("untoachable");

    clearInterval(aiFlipRandomCardTimeOut);
    clearInterval(aiTurnTimeOut);
    clearInterval(changeTurnTimeOut);
    clearInterval(checkWinTimeOut);
    clearInterval(closeCardsTimeOut);
    clearInterval(flipCardsTimeOut);
    clearInterval(flipCardsCloseTimeOut);

    aiFlipRandomCardTimeOut = null;
    aiTurnTimeOut = null;
    changeTurnTimeOut = null;
    checkWinTimeOut = null;
    closeCardsTimeOut = null;
    flipCardsTimeOut = null;
    flipCardsCloseTimeOut = null;
}

function displayWonGames() {
    $playerWonGames.innerHTML = playerWonGames;
    $aiWonGames.innerHTML = aiWonGames;
}

displayWonGames();