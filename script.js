let currentSolvedBoard, currentPlayableBoard, currentSolutions;

window.addEventListener('load', () => {
  // Create board
  const board = document.getElementById('board');
  const numbers = document.getElementById('numbers');
  for(let i = 0 ; i < 9 ; i++) {
    const number = document.createElement('div');
    number.classList.add('number');
    number.onclick = () => onFill(i + 1);
    number.innerText = `${i + 1}`;
    numbers.appendChild(number);
    for (let j = 0 ; j < 9 ; j++) {
      const square = document.createElement('div');
      square.id = `${i}-${j}`;
      square.classList.add('square');
      board.appendChild(square);
    }
  }
})

const getColumns = (currentPlayableBoard) => {
  const columns = []
  for (let i = 0 ; i < 9 ; i++) {
    columns.push([])
    for (let j = 0 ; j < 9 ; j++) {
      columns[i][j] = currentPlayableBoard[j][i]
    }
  }
  return columns;
}

const getSquares = (currentPlayableBoard) => {
  const squares = []
  for (let i = 0 ; i < 9 ; i += 3) {
    for (let j = 0 ; j < 9 ; j += 3) {
      squares.push([]);
      for (let k = 0 ; k < 3 ; k++) {
        for (let l = 0 ; l < 3 ; l++) {
          squares[squares.length - 1].push(currentPlayableBoard[i + k][j + l]);
        }
      }
    }
  }
  return squares;
}

const isUnique = (arr) => {
  for(let i = 1 ; i <= arr.length ; i++) {
    if (arr.includes(i)) {
      continue;
    }
    return false;
  }
  return true;
}

const isBoardValid = (board) => {
  const isRowsValid = board.every((row) => isUnique(row));
  const isColumnsValid = getColumns(board).every((row) => isUnique(row));
  const isSquaresValid = getSquares(board).every((row) => isUnique(row));
  return (isRowsValid && isColumnsValid && isSquaresValid);
}

const onSelect = (i, j) => {
  for (let k = 0 ; k < 9 ; k++) {
    for (let l = 0 ; l < 9 ; l++) {
      const square = document.getElementById(`${k}-${l}`);
      // Clear all previous highlights
      square.classList.remove('selected');
      square.classList.remove('highlight');
      // Square
      if ((Math.floor(k / 3) ===  Math.floor(i / 3)) && (Math.floor(l / 3) ===  Math.floor(j / 3))) {
        square.classList.remove('selected');
        square.classList.add('highlight');
      }
      // Row & column
      if ((k === i) || (l === j)) {
        square.classList.remove('selected');
        square.classList.add('highlight');
      }
      // Current selected
      if ((k === i) && (l === j)) {
        square.classList.remove('highlight');
        square.classList.add('selected');
      }
    }
  }
}

const onFill = (number) => {
  const selected = document.getElementsByClassName('selected')[0];
  if (selected) {
    const [i, j] = selected.id.split('-');
    currentPlayableBoard[i][j] = number;
    selected.style.color = 'black';
    selected.innerText = number;

    // Check for mistake
    if (currentPlayableBoard[i][j] !== currentSolvedBoard[i][j]) {
      selected.style.color = 'red';
      const mistakes = document.getElementById('mistakes');
      mistakes.innerText = (parseInt(mistakes.innerText) + 1).toString();
      if (mistakes.innerText === '3') {
        // Show / Hide relevant components
        document.getElementById('numbers').style.display = 'none';
        document.getElementById('game-over').style.display = 'flex';
        clearInterval(window.timerInterval);
      }
    }

  } else {
    console.log('Please select square!')
  }
}

const onStart = () => {
  // Show / Hide relevant components
  document.getElementById('numbers').style.display = 'flex'
  document.getElementById('congratulation').style.display = 'none'
  document.getElementById('game-over').style.display = 'none'
  document.getElementById('mistakes').innerText = '0';
  // Set board
  const difficulty = document.getElementById('difficulty');
  const difficultyLvl = document.querySelector('input[name="difficulty"]:checked').value;
  difficulty.style.textTransform = 'capitalize';
  difficulty.innerText = difficultyLvl;
  const {solvedBoard, playableBoard, solutions} = generateBoard(difficultyLvl);
  currentSolvedBoard = JSON.parse(JSON.stringify(solvedBoard))
  currentPlayableBoard = JSON.parse(JSON.stringify(playableBoard));
  currentSolutions = JSON.parse(JSON.stringify(solutions));
  // document.getElementById('solutions').innerText = solutions.length.toString();
  for(let i = 0 ; i < 9 ; i++) {
    for (let j = 0 ; j < 9 ; j++) {
      const square = document.getElementById(`${i}-${j}`);
      square.classList.remove('selected');
      square.classList.remove('highlight');
      if (currentPlayableBoard[i][j]) {
        square.style.color = 'gray';
        square.style.fontWeight = 'bold';
        square.innerText = currentPlayableBoard[i][j];
        square.onclick = null;
      } else {
        square.style.color = 'black';
        square.style.fontWeight = '400';
        square.innerText = '';
        square.onclick = () => onSelect(i, j);
      }
    }
  }

  // Set timer
  let seconds = 0;
  const timer = document.getElementById('timer');
  timer.innerText = '00:00';
  clearInterval(window.timerInterval);
  window.timerInterval = setInterval(() => {
    seconds += 1;
    const minutes = Math.floor(seconds / 60);
    timer.innerText = `${minutes.toString().padStart(2, '0')}:${Math.min(seconds - (minutes * 60), 59).toString().padStart(2, '0')}`
    if (seconds === 3600) {
      clearInterval(window.timerInterval);
    }
  }, 1000);
}

const onFinish = () => {
  if (isBoardValid(currentPlayableBoard)) {
    // Stop timer
    clearInterval(window.timerInterval);

    // Show / Hide relevant components
    document.getElementById('numbers').style.display = 'none'
    document.getElementById('congratulation').style.display = 'flex'
  }
}

const onSolve = () => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const isError = currentPlayableBoard[i][j] && (currentPlayableBoard[i][j] !== currentSolvedBoard[i][j]);
      const square = document.getElementById(`${i}-${j}`);
      if (currentPlayableBoard && isError) {
        square.style.color = 'red';
      }
      if (!currentPlayableBoard[i][j]) {
        square.style.color = 'blue';
        square.innerText = currentSolvedBoard[i][j];
        currentPlayableBoard[i][j] = currentSolvedBoard[i][j];
      }
    }
  }
  onFinish();
}
