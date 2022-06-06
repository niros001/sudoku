const defaultBoard = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 1, 5, 6, 4, 8, 9, 7],
  [5, 6, 4, 8, 9, 7, 2, 3, 1],
  [8, 9, 7, 2, 3, 1, 5, 6, 4],
  [3, 1, 2, 6, 4, 5, 9, 7, 8],
  [6, 4, 5, 9, 7, 8, 3, 1, 2],
  [9, 7, 8, 3, 1, 2, 6, 4, 5],
]

const getRandNumber = (arr) => {
  const rand = Math.floor(Math.random() * arr.length);
  const num = arr[rand];
  arr.splice(rand, 1);
  return num;
}

const shuffleDigits = (board) => {
  const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let num1 = getRandNumber(availableNumbers);
  let num2 = getRandNumber(availableNumbers);
  for (let i = 0 ; i < 9 ; i++) {
    for (let j = 0 ; j < 9 ; j++) {
      if(board[i][j] === num1) {
        board[i][j] = num2;
      }
      else if (board[i][j] === num2) {
        board[i][j] = num1;
      }
    }
  }
}

const shuffleColumns = (board) => {
  for (let i = 0 ; i < 9 ; i += 3) {
    const availablePositions = [i, i + 1, i + 2];
    let num1 = getRandNumber(availablePositions);
    let num2 = getRandNumber(availablePositions);
    for (let j = 0 ; j < 9 ; j++) {
      let tmp = board[num1][j];
      board[num1][j] = board[num2][j]
      board[num2][j] = tmp;
    }
  }
}

const shuffleColumnsGroup = (board) => {
  const availablePositions = [0, 1, 2];
  let num1 = getRandNumber(availablePositions);
  let num2 = getRandNumber(availablePositions);

  for (let i = 0 ; i < 3 ; i++) {
    for (let j = 0 ; j < 9 ; j++) {
      let tmp = board[j][(num1 * 3) + i];
      board[j][(num1 * 3) + i] = board[j][(num2 * 3) + i];
      board[j][(num2 * 3) + i] = tmp;
    }
  }
}

const shuffleRows = (board) => {
  for (let i = 0 ; i < 9 ; i += 3) {
    const availablePositions = [i, i + 1, i + 2];
    let num1 = getRandNumber(availablePositions);
    let num2 = getRandNumber(availablePositions);
    let tmp = board[num1];
    board[num1] = board[num2]
    board[num2] = tmp;
  }
  return board;
}

const shuffleRowsGroup = (board) => {
  const availablePositions = [0, 1, 2];
  let num1 = getRandNumber(availablePositions);
  let num2 = getRandNumber(availablePositions);
  for (let i = 0 ; i < 3 ; i++) {
    let tmp = board[(num1 * 3) + i];
    board[(num1 * 3) + i] = board[(num2 * 3) + i];
    board[(num2 * 3) + i] = tmp;
  }
}

const generateBoard = (difficulty) => {
  let solvedBoard = JSON.parse(JSON.stringify(defaultBoard));
  for (let i = 0 ; i < 10 ; i++) {
    shuffleDigits(solvedBoard);
  }
  for (let i = 0 ; i < 5 ; i++) {
    shuffleColumns(solvedBoard);
  }
  for (let i = 0 ; i < 5 ; i++) {
    shuffleColumnsGroup(solvedBoard);
  }
  for (let i = 0 ; i < 5 ; i++) {
    shuffleRows(solvedBoard);
  }
  for (let i = 0 ; i < 5 ; i++) {
    shuffleRowsGroup(solvedBoard);
  }
  const {playableBoard, solutions} = getPlayableBoard(solvedBoard, difficulty);
  return {solvedBoard, playableBoard, solutions};
}
