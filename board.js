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

const solver = (board, cb) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    const freeCell = getFreeCell(newBoard);
    if (freeCell) {
        const possibleNumbers = getPossibleNumbers(newBoard, ...freeCell);
        for (let i = 0 ; i < possibleNumbers.length ; i++) {
            newBoard[freeCell[0]][freeCell[1]] = possibleNumbers[i];
            solver(newBoard, cb)
        }
    } else {
        cb(newBoard);
    }
}

const getPlayableBoard = (solvedBoard, difficulty) => {
    const solutions = [];
    const newBoard = JSON.parse(JSON.stringify(solvedBoard))
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
    while (holes > 0) {
        const hole = getRandNumber(availableNumbers);
        const xPos = Math.floor(hole / 9);
        const yPos = hole % 9;
        const lastTry = newBoard[xPos][yPos];
        newBoard[xPos][yPos] = 0;
        solutions.splice(0, solutions.length);
        solver(newBoard, (solution) => solutions.push(solution));
        if (solutions.length === 1) {
            holes--;
        } else {
            newBoard[xPos][yPos] = lastTry;
        }
    }
    return newBoard;
}


const generateBoard = (difficulty) => {
    let counter = 0;
    const solutions = [];
    const tryBoard = JSON.parse(JSON.stringify(defaultBoard));
    const freeCells = [...Array(81).keys()].map((_, n) => n);
    for (let i = 0 ; i < 26 ; i++) {
        // Position
        const randPos = Math.floor(Math.random() * freeCells.length);
        const pos = freeCells[randPos];
        const xPos = Math.floor(pos / 9);
        const yPos = pos % 9;

        // Number
        const possibleNumbers = getPossibleNumbers(tryBoard, xPos, yPos);
        tryBoard[xPos][yPos] = possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)] || 0;
        freeCells.splice(randPos, 1);
    }
    try {
        solver(tryBoard, (solution) => {
            counter++
            if (counter === 2000000) {
                throw new Error('Too much attempts');
            }
            solutions.push(solution);
        });
    } catch (e) {
        return generateBoard(difficulty);
    }
    if(solutions.length) {
        const solvedBoard = solutions[Math.floor(Math.random() * solutions.length)];
        const playableBoard = getPlayableBoard(solvedBoard, difficulty);
        return ({playableBoard, solvedBoard})
    } else {
        return generateBoard(difficulty);
    }
}
