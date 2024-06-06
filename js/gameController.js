function flipCard(cardObject) {
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
        }, 3000);

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

    if (cardObject1.index === cardObject2.index) {
        foundPairs++;
        globalThis.clearTimeout(closeCardsTimeOut);
        closeCardsTimeOut = null;

        flippedCards = 0;
        openObjectCards = [];

        setTimeout(() => {
            vanishCards(cardObject1, cardObject2);
        }, 1000);

        clearTimeout(checkWinTimeOut);

        checkWinTimeOut = setTimeout(() => {
            if (foundPairs == cardIndex + 1) {
                openDialog("¡Has ganado!", "Has encontrado todas las cartas.");
            }
        }, 1750);
    }
}

function vanishCards(cardObject1, cardObject2) {
    cardObject1.cardElement.classList.add("found");
    cardObject2.cardElement.classList.add("found");
}