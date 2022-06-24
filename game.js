let currentSolvedBoard, currentPlayableBoard;
const worker = new Worker('board.js');

worker.onmessage = ({data}) => {
  const {solvedBoard, playableBoard} = data;
  currentSolvedBoard = JSON.parse(JSON.stringify(solvedBoard))
  currentPlayableBoard = JSON.parse(JSON.stringify(playableBoard));

  // Show / Hide relevant components
  document.getElementById('board').style.opacity = '1';
  document.getElementById('new-game').removeAttribute('disabled');
  document.getElementById('get-hint').removeAttribute('disabled');

  for(let i = 0 ; i < 9 ; i++) {
    for (let j = 0 ; j < 9 ; j++) {
      const square = document.getElementById(`${i}-${j}`);
      square.classList.remove('selected');
      square.classList.remove('highlight');
      square.classList.remove('static');
      square.classList.remove('dynamic');
      square.classList.remove('hint');
      square.classList.remove('error')
      if (currentPlayableBoard[i][j]) {
        square.classList.add('static');
        square.innerText = currentPlayableBoard[i][j];
        square.onclick = null;
      } else {
        square.classList.add('dynamic');
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
};

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
    const boardRow = document.createElement('div');
    boardRow.classList.add('board-row');
    board.appendChild(boardRow);
    for (let j = 0 ; j < 9 ; j++) {
      const square = document.createElement('div');
      square.id = `${i}-${j}`;
      square.classList.add('square');
      boardRow.appendChild(square);
    }
  }
})

document.addEventListener('keypress', ({key}) => {
  if (key >= 1 && key <= 9) {
    onFill(parseInt(key));
  }
}, false);


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
  const mistakes = document.getElementById('mistakes');
  if (selected && mistakes.innerText < 3) {
    const [i, j] = selected.id.split('-');
    currentPlayableBoard[i][j] = number;
    selected.classList.remove('error')
    selected.innerText = number;

    // Check for mistake
    if (currentPlayableBoard[i][j] !== currentSolvedBoard[i][j]) {
      selected.classList.add('error')
      const mistakes = document.getElementById('mistakes');
      mistakes.innerText = (parseInt(mistakes.innerText) + 1).toString();
      if (mistakes.innerText === '3') {
        // Show / Hide relevant components
        document.getElementById('numbers').style.display = 'none';
        document.getElementById('game-over').style.display = 'flex';
        clearInterval(window.timerInterval);
      }
    }

    // Check for solved board
    onFinish();

  } else {
    alert('Can\'t fill square!')
  }
}

const onStart = () => {
  // Show difficulty
  const difficulty = document.getElementById('difficulty');
  const difficultyLvl = document.querySelector('input[name="difficulty"]:checked').value;
  difficulty.style.textTransform = 'capitalize';
  difficulty.innerText = difficultyLvl;

  // Show / Hide relevant components
  document.getElementById('numbers').style.display = 'flex'
  document.getElementById('congratulation').style.display = 'none'
  document.getElementById('game-over').style.display = 'none'
  document.getElementById('mistakes').innerText = '0';
  document.getElementById('hints').innerText = '0';
  document.getElementById('board').style.opacity = '0.7';
  document.getElementById('new-game').setAttribute('disabled', '');

  // Generate board with worker
  worker.postMessage({exec: true, difficultyLvl});
}

const onFinish = () => {
  if (isBoardValid(currentPlayableBoard)) {
    // Stop timer
    clearInterval(window.timerInterval);

    // Show / Hide relevant components
    document.getElementById('numbers').style.display = 'none'
    document.getElementById('congratulation').style.display = 'flex'
    document.getElementById('get-hint').setAttribute('disabled', '');
  }
}

const onHint = () => {
  const freeCells = [];
  for (let i = 0 ; i < 9 ; i++) {
    for (let j = 0 ; j < 9 ; j++) {
      if (!currentPlayableBoard[i][j]) {
        freeCells.push([i, j]);
      }
    }
  }
  if (freeCells.length) {
    const [x, y] = freeCells[Math.floor(Math.random() * freeCells.length)];
    const square = document.getElementById(`${x}-${y}`);
    currentPlayableBoard[x][y] = currentSolvedBoard[x][y];
    square.classList.add('hint');
    square.innerText = currentSolvedBoard[x][y];
    const hints = document.getElementById('hints');
    hints.innerText = (parseInt(hints.innerText) + 1).toString();
    if (hints.innerText === '2') {
      document.getElementById('get-hint').setAttribute('disabled', '');
    }
    onFinish();
  } else {
      alert('There is no free cell!');
  }
}
