// script.js
document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("game-board");
  const ctx = canvas.getContext("2d");

  const ROWS = 20;
  const COLS = 10;
  const BLOCK_SIZE = canvas.width / COLS;

  const board = [];
  for (let row = 0; row < ROWS; row++) {
    board[row] = [];
    for (let col = 0; col < COLS; col++) {
      board[row][col] = 0;
    }
  }


  let currentPiece = generateRandomPiece();
  let dropCounter = 0;
  let dropInterval = 1000; // milliseconds
  let lastTime = 0;
  let score = 0;
  let level = 1;
  let linesCleared = 0;
  let gameOver = false;
  let linhaatual=0;
  let ultimalinha=0;
  let primeiravez=0
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece();
    drawScore();
   // linhaatual=linhaatual+1 incrementa demais!!!
    // Outros elementos do jogo
  }

  function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        drawBlock(col, row, board[row][col]);
      }
    }
    // linhaatual=linhaatual+1; incrementa demais
  }

  function drawBlock(x, y, colorIndex) {
    ctx.fillStyle = ["#000", "#F00", "#0F0", "#00F", "#F0F", "#FF0", "#0FF", "#FFF"][colorIndex];
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "#AAA";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
//linhaatual=linhaatual+1; incrementa demais
  }

  function drawPiece() {
    currentPiece.shape.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value !== 0) {
          drawBlock(currentPiece.x + j, currentPiece.y + i, currentPiece.color);
          //linhaatual=linhaatual+1 aqui acelera
        }
      });
    });
    //linhaatual=linhaatual+1; incrementa demais
  }

    function update(time = 10) {
   // const deltaTime = time - lastTime;
      const deltaTime=100;
    //lastTime = time;
      lastTime = 100000;

    dropCounter += deltaTime;
    if (dropCounter > 10000) {
      dropCounter = 0;
           
      movePieceDown();
    }
 
    draw();
    requestAnimationFrame(update);
 
  }

  function movePieceDown() {
      primeiravez=1;
    if (!checkCollision(0, 1)) {
      currentPiece.y++;
      linhaatual= linhaatual+1;
      if (linhaatual > 18) {
        linhaatual=1;
        
      }
    } else {
      mergePiece();
      currentPiece = generateRandomPiece();
      linhaatual=1;
    }
  }

  function movePieceLeft() {
    if (!checkCollision(-1, 0)) {
      currentPiece.x--;
    }
  }

  function movePieceRight() {
    if (!checkCollision(1, 0)) {
      currentPiece.x++;
    }
  }

  function rotatePiece() {
    const rotatedPiece = rotate(currentPiece.shape);
    if (!checkCollision(0, 0, rotatedPiece)) {
      currentPiece.shape = rotatedPiece;
    }
  }

  function checkCollision(xOffset, yOffset, piece = currentPiece.shape) {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x] !== 0) {
          const newX = currentPiece.x + x + xOffset;
          const newY = currentPiece.y + y + yOffset;
          
          if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY][newX] !== 0) {
            
            return true;
          }
        }
      }
    }

    return false;
  }

  function mergePiece() {
    currentPiece.shape.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value !== 0) {
          board[currentPiece.y + i][currentPiece.x + j] = currentPiece.color;
        }
      });
    });
 
    clearLines();
  }


  function checkGameOver() {
      return board[0].some(block => block !== 0); // Verifica se há algum bloco na primeira linha
  }
  
  
  function clearLines() {
    let linesClearedThisTurn = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (board[y].every(block => block !== 0)) {
        board.splice(y, 1);
        board.unshift(new Array(COLS).fill(0));
        linesCleared++;
        linesClearedThisTurn++;

      }
    }
   
    score += linesClearedThisTurn * 100;
    level = Math.floor(linesCleared / 10) + 1;
   
      if (checkGameOver()) {
          gameover1();
          return; 
      }
    if (linesCleared>=10) {
        voceganhou();
        return; 
    }
  }

  function generateRandomPiece() {
    const pieces = [
      { shape: [[1, 1, 1, 1]], color: 1 },  // I
      { shape: [[1, 1], [1, 1]], color: 2 }, // O
      { shape: [[1, 1, 1], [0, 1, 0]], color: 3 }, // T
      { shape: [[1, 1, 0], [0, 1, 1]], color: 4 }, // S
      { shape: [[0, 1, 1], [1, 1, 0]], color: 5 }, // Z
      { shape: [[1, 1, 1], [1, 0, 0]], color: 6 }, // L
      { shape: [[1, 1, 1], [0, 0, 1]], color: 7 }  // J
    ];
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      shape: piece.shape,
      color: piece.color,
      x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0
    };

  }

  function rotate(matrix) {
    const rotatedMatrix = [];
    for (let i = 0; i < matrix[0].length; i++) {
      rotatedMatrix.push(matrix.map(row => row[i]).reverse());
    }
    return rotatedMatrix;
  }

  function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Linhas: ${linesCleared}`, 10, 60);

  }

  document.getElementById("left-btn").addEventListener("click", movePieceLeft);
  document.getElementById("right-btn").addEventListener("click", movePieceRight);
  document.getElementById("rotate-btn").addEventListener("click", rotatePiece);
  document.getElementById("down-btn").addEventListener("click", movePieceDown);

  document.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") {
      movePieceDown();
    } else if (event.key === "ArrowLeft") {
      movePieceLeft();
    } else if (event.key === "ArrowRight") {
      movePieceRight();
    } else if (event.key === "ArrowUp") {
      rotatePiece();
    }
  });


  function  gameover1() {

   alert("Que pena! Você não ganhou, mais pode tentar quantas vezes quiser!");

      gameOver2();

  }

  function  voceganhou() {

   alert("Parabéns! Você conquistou 10  linhas para celebrar os 3 meses de vida de Joana. Você é uma pessoa muito especial!");

    gameOver2();

  }


  function gameOver2() {

          // Reiniciar todas as variáveis do jogo
          board.forEach(row => row.fill(0));
          score = 0;
          level = 1;
          linesCleared = 0;
          currentPiece = generateRandomPiece();



          // Reiniciar o loop de atualização do jogo
          update();


          // Recarregar a página após 2 segundos
          //setTimeout(() => {
          //    location.reload();
          //}, 2000);
  }




  
  update();
});


