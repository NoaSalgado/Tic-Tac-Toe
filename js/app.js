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

    const disableCells = () => {
        cells.forEach((cell) => {
            cell.style.pointerEvents = 'none';
        });
    };
    return {
        cells,
        restartBtn,
        displayPlayerSymbol,
        changeGameText,
        disableCells,
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

    const makeMove = (e) => {
        const { cell } = e.target.dataset;
        console.log(cell);
        gameBoard.setBoardPosition(cell, currentPlayer);

        if (playerWon()) {
            displayController.changeGameText(`${currentPlayer} WON!!!`);
            displayController.disableCells();
        } else {
            currentPlayer =
                currentPlayer === player1.symbol
                    ? player2.symbol
                    : player1.symbol;
        }
    };

    const restartGame = () => {
        gameBoard.resetBoard();
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
