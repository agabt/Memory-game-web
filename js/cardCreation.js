$startGame.addEventListener("click", startTheGame);
$resetGame.addEventListener("click", createGameBoard);

function startTheGame() {
    gameHeight = parseInt($heightInput.value);
    gameWidth = parseInt($widthInput.value);

    if (isNaN(gameHeight) || isNaN(gameWidth)) {
        openDialog("Los números no són validos", "Probablemente no has introducido ningún número en los campos.");
        gameHeight = 0;
        gameWidth = 0;
        return;
    }

    if ((gameHeight * gameWidth) % 2 != 0) {
        openDialog("El resultado no és un número par",
            `La configuración de cartas ${gameHeight} x ${gameWidth} és igual a ${gameHeight * gameWidth}, que no és un número par.`);
        return;
    }

    createGameBoard();
}

function createGameBoard() {
    resetVariables();
    shuffleArray(cardFrontImages);

    for (let i = 0; i < gameHeight; i++) {
        for (let j = 0; j < gameWidth; j++) {
            if ((i * gameWidth + j) % 2 == 0) {
                cardIndex++;
            }

            buildCard();
        }
    }

    displayCards();
}

function buildCard() {
    const $card = document.createElement("div");
    const $cardBack = document.createElement("div");
    const $cardFront = document.createElement("div");
    const $cardFrontImg = document.createElement("img");
    $cardBack.classList.add("face", "back");
    $cardFront.classList.add("face", "front");
    $cardFront.appendChild($cardFrontImg);
    $card.appendChild($cardBack);
    $card.appendChild($cardFront);
    $card.classList.add("card", "not-flipped");
    $cardFrontImg.src = `../assets/img/${cardFrontImages[cardIndex]}.webp`;

    const cardObject = {
        index: cardIndex,
        cardElement: $card
    }

    $card.addEventListener("click", () => {
        flipCard(cardObject);
    });

    allObjectCards.push(cardObject);
}

function displayCards() {
    shuffleArray(allObjectCards);

    for (let i = 0; i < gameHeight; i++) {
        const $row = document.createElement("div");
        $row.className = "row";
        $gameBoard.appendChild($row);

        for (let j = 0; j < gameWidth; j++) {
            $row.appendChild(allObjectCards[i * gameWidth + j].cardElement);
        }
    }
}

function shuffleArray(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

function openDialog(title, message) {
    $dialogTitle.textContent = title;
    $dialogInfo.textContent = message;
    $dialog.style.display = "flex";
    $dialog.showModal();

    $dialog.onclick = closeDialog;
}

function closeDialog() {
    $dialog.style.display = "none";
    $dialog.close();
}


// Testing zone
/* for (let i = 0; i < 8; i++) {
    const $row = document.createElement("div");
    $row.className = "row";
    $gameBoard.appendChild($row);
    for (let j = 0; j < 8; j++) {
        const $cell = document.createElement("div");
        $cell.className = "cell";
        $row.appendChild($cell);
    }
} */