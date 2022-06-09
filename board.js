const defaultBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const getRandNumber = (arr) => {
    const rand = Math.floor(Math.random() * arr.length);
    const num = arr[rand];
    arr.splice(rand, 1);
    return num;
}

const getPossibleNumbers = (board, i, j) => {
    const possibleNumbers = [];
    const filledNumbers = [];
    // Row
    for (let k = 0 ; k < 9 ; k++) {
        if (board[i][k] !== 0) {
            filledNumbers.push(board[i][k]);
        }
    }
    // Column
    for (let k = 0 ; k < 9 ; k++) {
        if (board[k][j] !== 0) {
            filledNumbers.push(board[k][j]);
        }
    }

    // Square
    for (let k = 0 ; k < 9 ; k++) {
        for (let l = 0 ; l < 9 ; l++) {
            if ((Math.floor(k / 3) ===  Math.floor(i / 3)) && (Math.floor(l / 3) ===  Math.floor(j / 3))) {
                if (board[k][l] !== 0) {
                    filledNumbers.push(board[k][l]);
                }
            }
        }
    }

    for (let k = 1 ; k <= 9 ; k++) {
        if (!filledNumbers.includes(k)) {
            possibleNumbers.push(k)
        }
    }
    return possibleNumbers;
}

const getFreeCell = (board) => {
    for (let i = 0 ; i < board.length ; i++) {
        for (let j = 0 ; j < board.length ; j++) {
            if (!board[i][j]) {
                return [i, j];
            }
        }
    }
    return null;
}

const solver = (board, history = {}, solutions = [], multipleSolutions = false, debug = false) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    const freeCell = getFreeCell(newBoard);
    if (freeCell) {
        // Get possible numbers with history
        let cellHistory = history[freeCell.join('-')];
        const possibleNumbers = cellHistory || getPossibleNumbers(newBoard, ...freeCell);

        // There is some possibilities to try
        if (possibleNumbers.length) {
            if (!cellHistory) {
                // Init history on first time per free cell
                cellHistory = JSON.parse(JSON.stringify(possibleNumbers));
            }
            // Add new number to the board
            newBoard[freeCell[0]][freeCell[1]] = possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)];

            // Remove the number from the history - to not try again same number
            cellHistory.splice(cellHistory.findIndex((n) => n === newBoard[freeCell[0]][freeCell[1]]), 1);

            // Go next cell
            return solver(newBoard, {...history, [freeCell.join('-')]: cellHistory}, solutions)
        } else { // Go back to last cell and try other number
            // Remove current cell history
            delete history[freeCell.join('-')];

            // Remove the number from the last cell
            if (Object.keys(history).length) {
                const lastFreeCell = (Object.keys(history)[Object.keys(history).length - 1]).split('-');
                newBoard[lastFreeCell[0]][lastFreeCell[1]] = 0;

                // Go last cell
                return solver(newBoard, history, solutions)
            } else {
                if (!multipleSolutions) {
                    return solutions;
                }
            }
        }
    } else {
        return [newBoard];
    }
}

const getPlayableBoard = (solvedBoard, difficulty) => {
    const newBoard = JSON.parse(JSON.stringify(solvedBoard))
    const availableNumbers = [...Array(81).keys()];
    let holes;
    switch (difficulty) {
        case 'easy': {
            holes = 35;
            break;
        }
        case 'medium': {
            holes = 40;
            break;
        }
        case 'hard': {
            holes = 45;
            break;
        }
    }
    while (holes > 0) {
        const hole = getRandNumber(availableNumbers);
        const xPos = Math.floor(hole / 9);
        const yPos = hole % 9;
        const lastTry = newBoard[xPos][yPos];
        newBoard[xPos][yPos] = 0;

        if (solver(newBoard).length === 1) {
            holes--;
        } else {
            newBoard[xPos][yPos] = lastTry;
        }
    }
    return newBoard;
}


const generateBoard = (difficulty) => {
    try {
        const solutions = solver(JSON.parse(JSON.stringify(defaultBoard)));
        const solvedBoard = solutions[Math.floor(Math.random() * solutions.length)];
        const playableBoard = getPlayableBoard(solvedBoard, difficulty);
        return ({playableBoard, solvedBoard})
    } catch (e) {
        return generateBoard(difficulty);
    }

}
