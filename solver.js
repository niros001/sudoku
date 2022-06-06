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

const solutions = [];
const solver = (board) => {
    const mewBoard = JSON.parse(JSON.stringify(board));
    const freeCell = getFreeCell(mewBoard);
    if (freeCell) {
        const possibleNumbers = getPossibleNumbers(mewBoard, ...freeCell);
        for (let i = 0 ; i < possibleNumbers.length ; i++) {
            mewBoard[freeCell[0]][freeCell[1]] = possibleNumbers[i];
            solver(mewBoard)
        }
    } else {
        solutions.push(mewBoard);
    }
}

const getPlayableBoard = (board, difficulty) => {
    const newBoard = JSON.parse(JSON.stringify(board))
    const availableNumbers = [...Array(81).keys()];
    let holes;
    switch (difficulty) {
        case 'easy': {
            holes = 30;
            break;
        }
        case 'medium': {
            holes = 40;
            break;
        }
        case 'hard': {
            holes = 50;
            break;
        }
    }
    for (let i = 0 ; i < holes ; i++) {
        const hole = getRandNumber(availableNumbers);
        const xPos = Math.floor(hole / 9);
        const yPos = hole % 9;
        newBoard[xPos][yPos] = 0;
    }
    solutions.splice(0, solutions.length);
    solver(newBoard);
    return {playableBoard: newBoard, solutions};
}
