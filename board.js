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

const copyOf = (v) => JSON.parse(JSON.stringify(v))

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

let solutions = [];
const solver = (board, singleBoard) => {
    if (singleBoard && solutions.length) return;
    if (solutions.length > 1) return; // No need to find many solutions - just check if have more then 1
    const newBoard = copyOf(board);
    const freeCell = getFreeCell(newBoard);
    if (freeCell) {
        const possibleNumbers = getPossibleNumbers(newBoard, ...freeCell);
        while (possibleNumbers.length) {
            newBoard[freeCell[0]][freeCell[1]] = getRandNumber(possibleNumbers);
            solver(newBoard, singleBoard);
        }
    } else {
        solutions.push(newBoard)
    }
}

const getPlayableBoard = (solvedBoard, difficulty) => {
    const newBoard = copyOf(solvedBoard)
    const availableNumbers = [...Array(81).keys()];
    let holes;
    switch (difficulty) {
        case 'easy': {
            holes = Math.floor(81 * 0.4); // 40% hidden
            break;
        }
        case 'medium': {
            holes = Math.floor(81 * 0.5); // 50% hidden
            break;
        }
        case 'hard': {
            holes = Math.floor(81 * 0.6); // 60% hidden
            break;
        }
    }
    while (holes > 0) {
        const hole = getRandNumber(availableNumbers);
        const xPos = Math.floor(hole / 9);
        const yPos = hole % 9;
        const lastTry = newBoard[xPos][yPos];
        newBoard[xPos][yPos] = 0;
        solutions = []
        solver(copyOf(newBoard), false);
        if (solutions.length === 1) {
            holes--;
        } else {
            newBoard[xPos][yPos] = lastTry;
        }
        if (!availableNumbers.length) {
            // Regenerate board
            // throw new Error('Many attempts to find one solution for this board')

            // Just show the board - for better performance
            return newBoard;
        }
    }
    return newBoard;
}


const generateBoard = (difficulty) => {
    // Create solved board
    solutions = [];
    solver(copyOf(defaultBoard), true);
    const solvedBoard = solutions[0];

    // Create playable board
    let playableBoard

    while (!playableBoard) {
        try {
            playableBoard = getPlayableBoard(solvedBoard, difficulty);
        } catch (e) {
            console.log(e.message)
        }
    }
    return ({playableBoard, solvedBoard})
}

onmessage = ({data: {exec, difficultyLvl}}) => {
    if(exec) {
        postMessage(generateBoard(difficultyLvl));
    }
};

