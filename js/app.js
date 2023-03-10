const playerFactory = (symbol) => ({ symbol });

const displayController = (() => {
    const gameText = document.querySelector('.game-text');
    const cells = document.querySelectorAll('.gameboard__cell');
    const restartBtn = document.querySelector('.restart-btn');

    const changeGameText = (text) => {
        gameText.textContent = text;
    };

    const displayPlayerSymbol = (id, symbol) => {
        cells[id].textContent = symbol;
    };

    const disableSelectedCell = (cell) => {
        cells[cell].style.pointerEvents = 'none';
    };

    const disableAllCells = () => {
        cells.forEach((cell) => {
            cell.style.pointerEvents = 'none';
        });
    };

    const enableCells = () => {
        cells.forEach((cell) => {
            cell.style.pointerEvents = 'all';
        });
    };
    return {
        cells,
        restartBtn,
        displayPlayerSymbol,
        changeGameText,
        disableSelectedCell,
        disableAllCells,
        enableCells,
    };
})();

const gameBoard = (() => {
    const board = Array(9).fill('');

    const setBoardPosition = (cell, symbol) => {
        if (!board[cell]) {
            board[cell] = symbol;
            displayController.displayPlayerSymbol(cell, symbol);
        }
    };

    const resetBoard = () => {
        board.fill('');
        displayController.cells.forEach((cell) => {
            displayController.displayPlayerSymbol(cell.dataset.cell, '');
        });
    };
    return { board, setBoardPosition, resetBoard };
})();

const gameController = (() => {
    const player1 = playerFactory('X');
    const player2 = playerFactory('O');
    let currentPlayer = player1.symbol;

    const playerWon = () => {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [2, 4, 6],
        ];

        const isWinner = winningCombos.reduce((noWinnerCombo, combo) => {
            const [pos1, pos2, pos3] = combo;
            if (
                gameBoard.board[pos1] &&
                gameBoard.board[pos1] === gameBoard.board[pos2] &&
                gameBoard.board[pos1] === gameBoard.board[pos3]
            ) {
                return true;
            }
            return noWinnerCombo;
        }, false);

        return isWinner;
    };

    const playersTied = () => {
        const filledPositions = gameBoard.board.reduce((acc, position) => {
            if (position) {
                acc++;
            }
            return acc;
        }, 0);

        return filledPositions === 9;
    };

    const makeMove = (e) => {
        const { cell } = e.target.dataset;
        displayController.disableSelectedCell(cell);
        gameBoard.setBoardPosition(cell, currentPlayer);

        if (playerWon()) {
            displayController.changeGameText(`${currentPlayer} WON!!!`);
            displayController.disableAllCells();
        } else if (playersTied()) {
            displayController.changeGameText(`IT??S A DRAW!!`);
        } else {
            currentPlayer =
                currentPlayer === player1.symbol
                    ? player2.symbol
                    : player1.symbol;
            displayController.changeGameText(`${currentPlayer} TURN`);
        }
    };

    const restartGame = () => {
        gameBoard.resetBoard();
        displayController.enableCells();
        displayController.changeGameText('X TURN');
    };

    const startGame = () => {
        displayController.cells.forEach((cell) => {
            cell.addEventListener('click', makeMove);
        });

        displayController.restartBtn.addEventListener('click', restartGame);
    };

    return { startGame };
})();

gameController.startGame();
