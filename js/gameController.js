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
    const [cardObject1, cardObject2] = openObjectCards;
    clearTimeout(changeTurnTimeOut);
    changeTurnTimeOut = null;

    if (cardObject1.index === cardObject2.index) {
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
                openDialog("¡Has ganado!", "Has encontrado todas las cartas.");
            }
        }, 1750);

        return;
    }

    changeTurnTimeOut = setTimeout(() => {
        changeTurn();
    }, 2000);
}

function vanishAndDeleteCards(cardObject1, cardObject2) {
    cardObject1.cardElement.classList.add("found");
    cardObject2.cardElement.classList.add("found");

    removeCardFromAllObjectCards(cardObject1, cardObject2);
    removeCardFromAiKnownCards(cardObject1, cardObject2);
    openObjectCards = [];
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

    flipCard(cardObject);

    if (flippedCards >= 2) {
        return;
    }

    setTimeout(() => {
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
            // const TIME_OUT = index % 2 === 0 ? 1500 * index : 500 * index;
            const TIME_OUT = 500 * index;

            setTimeout(() => {
                flipCard(cardToFlip);
            }, TIME_OUT);
        });

    }

    setTimeout(() => {
        aiFlipRandomCard();
    }, checkedPairs.length * 500 + 1000);
}
