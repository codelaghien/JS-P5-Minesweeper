const assets = 'assets/';
const imageNames = {
	0: 'square_PNG82-2.png',
	1: 'number1_PNG14898.png',
	2: 'Number 2 PNG images.png',
	3: 'number3_PNG14982.png',  
	4: 'number4_PNG15008.png',
	5: 'number5_PNG15092.png',
	6: 'number6_PNG18593.png',
	7: 'number7_PNG18639.png',
	8: 'number8_PNG18688.png',
	untouch: 'square_PNG95.png',
	bombFlag: 'bomb_PNG31.png',
	bombSmile: 'smiley_PNG6.png',
	bomb: 'bomb_PNG41.png',
	bombRed: 'bomb_PNG41-red.png',
	bombWrong: 'bomb_PNG41-wrong.png',
	ohmygosh: 'smiley_PNG126.png',
	sobomb: 'so-bomb.png',
	dongho: 'dong-ho.png',
};

let imageNumbers = [];
let imageUntouch;
let imageBombFlag;
let imageBombSmile;
let imageBomb;
let imageBombRed;
let imageBombRedOhMyGosh;
let imageBombWrong;
let imageSoBomb;
let imageWatch;
let buttonStart;

let imageSize = 50;
let rows = 10;
let cols = 15;
let cellSize;
let boardLeft = 10;
let boardTop = 50;
let bombs = Math.floor(rows * cols * 0.07);
let bombsLeft = bombs;
let width;
let height;
let board;
let gameOver = false;
let gameTime = 0;
let gameLastTime = -10;
let gameStart = false;
let congrats = false;
let congratsInfo = {
	x: 0,
	y: 0,
	message: 'Bạn quá siêu !',
	fontSize: 5,
	angle: 0,
	angleInc: 0,
};
let phantramBom;

function preload() {
	loadImages();
	buttonStart = createImg(assets + 'animated-emoticons-2018-4.gif');
	buttonStart.id('buttonStart');
	document.getElementById('buttonStart').width = imageSize;
	document.getElementById('buttonStart').border = '1';
	document.getElementById('buttonStart').style.cursor = 'pointer';
	buttonStart.mousePressed(startGame);
	document.getElementById('buttonStart').title =
		'Bấm vào để chơi lại game mới !';
}

function setup() {
	width = windowWidth - 30;
	height = windowHeight - 30;
	// console.log('width = ' + width + ', height = ' + height);
	boardLeft = (width - cols * imageSize) / 2 - 2;
	boardTop =
		boardTop < imageSoBomb.width + 10 ? imageSoBomb.width + 10 : boardTop;
	boardTop = boardTop < imageSize + 20 ? imageSize + 20 : boardTop;
	createCanvas(width, height);
	frameRate(30);
	init();
}

function startGame() {
	gameStart = false;
	gameOver = false;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			board[row][col].init();
		}
	}
	phantramBomSelect();
	let bombsGenerated = 0;
	while (bombsGenerated < bombs) {
		let row = int(random(0, rows));
		let col = int(random(0, cols));
		if (!board[row][col].isBomb) {
			board[row][col].isBomb = true;
			increment(row, col);
			bombsGenerated++;
		}
	}
	gameTime = 0;
	bombsLeft = bombs;
	gameLastTime = -10;
	congrats = false;
}

function checkWin() {
	let won = true;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (board[row][col].isBomb) {
				if (!board[row][col].bombFlag) {
					won = false;
					break;
				}
			} else if (!board[row][col].revealed) {
				won = false;
				break;
			}
		}
		if (!won) {
			break;
		}
	}
	if (won && bombsLeft === 0) {
		gameOver = true;
		gameStart = false;
		congratsInfo.x = width / 2;
		congratsInfo.y = boardTop + (rows * imageSize) / 2;
		congratsInfo.fontSize = 5;
		congratsInfo.angle = 0;
		congrats = true;
	}
}

function loadImages() {
	for (let key in imageNames) {
		loadImage(assets + imageNames[key], (img) => {
			img.resize(imageSize, imageSize);
			if (+key >= 0 && +key <= 8) {
				imageNumbers[+key] = img;
			} else if (key === 'untouch') {
				imageUntouch = img;
			} else if (key === 'bombFlag') {
				imageBombFlag = img;
			} else if (key === 'bombSmile') {
				imageBombSmile = img;
			} else if (key === 'bomb') {
				imageBomb = img;
			} else if (key === 'bombRed') {
				imageBombRed = img;
			} else if (key === 'ohmygosh') {
				imageBombRedOhMyGosh = img;
			} else if (key === 'bombWrong') {
				imageBombWrong = img;
			} else if (key === 'sobomb') {
				imageSoBomb = img;
				img.resize(
					imageSize > 40 ? 40 : imageSize,
					imageSize > 40 ? 40 : imageSize
				);
			} else if (key === 'dongho') {
				img.resize(
					imageSize > 40 ? 40 : imageSize,
					imageSize > 40 ? 40 : imageSize
				);
				imageWatch = img;
			}
		});
	}
}

function draw() {
	background(255);
	if (gameStart) {
		gameTime++;
	}
	drawStatus();
	noFill();
	strokeWeight(5);
	stroke('gray');
	rect(
		boardLeft - 2,
		boardTop - 2,
		cols * imageSize + 4,
		rows * imageSize + 4
	);

	if (!gameOver && mouseIsPressed && gameTime - gameLastTime > 3) {
		gameLastTime = gameTime;
		myMouseClicked();
	}
	drawBoard(gameOver);
	if (congrats) {
		showCongrats();
	}
}

function init() {
	congratsInfo.angleInc = PI / 5;
	document.oncontextmenu = function () {
		return false;
	};
	phantramBom = createSelect();
	phantramBom.width = 50;
	phantramBom.option('1%');
	phantramBom.option('2%');
	phantramBom.option('3%');
	phantramBom.option('4%');
	phantramBom.option('5%');
	phantramBom.option('10%');
	phantramBom.option('15%');
	phantramBom.option('20%');
	phantramBom.option('25%');
	phantramBom.option('30%');
	phantramBom.option('40%');
	phantramBom.option('50%');
	phantramBom.selected('1%');
	phantramBom.changed(phantramBomSelect);

	cellSize = createSelect();
	cellSize.width = 50;
	cellSize.option('30 pixels');
	cellSize.option('40 pixels');
	cellSize.option('50 pixels');
	cellSize.option('70 pixels');
	cellSize.option('100 pixels');
	cellSize.option('120 pixels');
	cellSize.selected('50 pixels');
	cellSize.changed(cellSizeSelect);
	cellSizeSelect();
}

function initGame() {
	board = [];
	for (let row = 0; row < rows; row++) {
		board[row] = [];
		for (let col = 0; col < cols; col++) {
			board[row][col] = new Cell(boardLeft, boardTop, row, col);
		}
	}
}

function phantramBomSelect() {
	bombs = int((+phantramBom.value().replace('%', '') * rows * cols) / 100);
	if (bombs < 1) {
		bombs = 1;
	} else if (bombs >= rows * cols) {
		bombs = rows * cols - 1;
	}
}

function cellSizeSelect() {
	imageSize = +cellSize.value().replace(' pixels', '');
	rows = int((height - boardTop - 4) / imageSize);
	cols = int((width - 100) / imageSize);
	boardLeft = (width - cols * imageSize) / 2 - 2;
	initGame();
	startGame();
	loadImages();
}

function increment(row, col) {
	let x = col - 1;
	let y = row - 1;
	if (x >= 0) {
		if (y >= 0) {
			board[y][x].bombs++;
		}
		y = row;
		board[y][x].bombs++;
		y = row + 1;
		if (y < rows) {
			board[y][x].bombs++;
		}
	}

	x = col;
	y = row - 1;
	if (y >= 0) {
		board[y][x].bombs++;
	}
	y = row + 1;
	if (y < rows) {
		board[y][x].bombs++;
	}

	x = col + 1;
	if (x < cols) {
		y = row - 1;
		if (y >= 0) {
			board[y][x].bombs++;
		}
		y = row;
		board[y][x].bombs++;
		y = row + 1;
		if (y < rows) {
			board[y][x].bombs++;
		}
	}
}

function drawBoard(gameOver) {
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (gameOver) {
				board[row][col].showBombs(
					frameCount % 30 < 25 ? imageBombRedOhMyGosh : imageBombRed,
					frameCount % 30 < 15 ? imageBombSmile : imageBombFlag
				);
			} else {
				board[row][col].draw();
			}
		}
	}
}

function myMouseClicked() {
	if (
		mouseY < boardTop ||
		mouseX < boardLeft ||
		mouseY > boardTop + rows * imageSize ||
		mouseX > boardLeft + cols * imageSize
	) {
		gameLastTime = -10;
		return;
	}
	const row = int((mouseY - boardTop) / imageSize);
	const col = int((mouseX - boardLeft) / imageSize);
	if (row >= 0 && row < rows && col >= 0 && col < cols) {
		gameStart = true;
		if (mouseButton === LEFT) {
			if (isEmptyCell(row, col)) {
				let revealList = [];
				revealList.push({ row, col });
				reveal(revealList);
			} else if (!board[row][col].reveal()) {
				gameOver = true;
				bombsLeft = bombs;
				gameStart = false;
			} else {
				if (board[row][col].bombFlag) {
					bombsLeft++;
					board[row][col].bombFlag = false;
				}
			}
		}
		if (mouseButton === RIGHT && !board[row][col].revealed) {
			if (board[row][col].bombFlag) {
				bombsLeft++;
				board[row][col].bombFlag = false;
			} else {
				board[row][col].bombFlag = true;
				bombsLeft--;
			}
		}
		checkWin();
	}
}

function isEmptyCell(row, col) {
	return (
		!board[row][col].revealed &&
		board[row][col].bombs === 0 &&
		!board[row][col].isBomb
	);
}

function revealAt(row, col) {
	if (row < 0 || row >= rows || col < 0 || col >= cols) {
		return false;
	}
	if (isEmptyCell(row, col)) {
		return true;
	} else if (
		!board[row][col].revealed &&
		!board[row][col].isBomb &&
		!board[row][col].bombFlag
	) {
		board[row][col].revealed = true;
	}
	return false;
}

function reveal(revealList) {
	if (!revealList || revealList.length === 0) {
		checkWin();
		return;
	}
	const location = revealList.pop();
	if (board[location.row][location.col].bombFlag) {
		bombsLeft++;
		board[location.row][location.col].bombFlag = false;
	}
	board[location.row][location.col].revealed = true;

	if (revealAt(location.row - 1, location.col - 1)) {
		revealList.push({ row: location.row - 1, col: location.col - 1 });
	}
	if (revealAt(location.row, location.col - 1)) {
		revealList.push({ row: location.row, col: location.col - 1 });
	}
	if (revealAt(location.row + 1, location.col - 1)) {
		revealList.push({ row: location.row + 1, col: location.col - 1 });
	}

	if (revealAt(location.row - 1, location.col)) {
		revealList.push({ row: location.row - 1, col: location.col });
	}
	if (revealAt(location.row + 1, location.col)) {
		revealList.push({ row: location.row + 1, col: location.col });
	}

	if (revealAt(location.row - 1, location.col + 1)) {
		revealList.push({ row: location.row - 1, col: location.col + 1 });
	}
	if (revealAt(location.row, location.col + 1)) {
		revealList.push({ row: location.row, col: location.col + 1 });
	}
	if (revealAt(location.row + 1, location.col + 1)) {
		revealList.push({ row: location.row + 1, col: location.col + 1 });
	}
	reveal(revealList);
}

function showCongrats() {
	strokeWeight(5);
	fill('red');
	stroke('blue');
	textSize(congratsInfo.fontSize);
	if (textWidth(congratsInfo.message) + textWidth('ABC') < cols * imageSize) {
		congratsInfo.x = (width - textWidth(congratsInfo.message)) / 2;
		congratsInfo.y =
			boardTop + imageSize + (rows * imageSize - textAscent()) / 2;
		if (congratsInfo.angle < 8 * PI) {
			congratsInfo.fontSize += 1;
		} else {
			congratsInfo.fontSize += int(congratsInfo.fontSize * 0.2);
		}
	} else if (random(1) < 0.007) {
		congratsInfo.x = width / 2;
		congratsInfo.y = boardTop + (rows * imageSize) / 2 + imageSize;
		congratsInfo.fontSize = 5;
		congratsInfo.angle = 0;
	}
	if (congratsInfo.angle < 8 * PI) {
		congratsInfo.angle += congratsInfo.angleInc;
	}

	push();
	translate(width / 2, boardTop + (rows * imageSize) / 2 + imageSize / 2);
	rotate(congratsInfo.angle);
	text(congratsInfo.message, -textWidth(congratsInfo.message) / 2, 0);
	pop();
}

function drawStatus() {
	strokeWeight(1);
	fill('blue');
	stroke('blue');
	textSize(40);
	image(imageSoBomb, board[0][0].x, boardTop - imageSoBomb.width - 10);
	phantramBom.position(board[0][0].x + imageSoBomb.width + 15, boardTop - 25);
	text(
		bombsLeft,
		board[0][0].x + imageSoBomb.width + phantramBom.width + 20,
		boardTop - 15
	);

	let timeSpent = int(gameTime / 30);
	const mins = int(timeSpent / 60);
	const secs = timeSpent - mins * 60;
	timeSpent = mins + ':' + (secs < 10 ? '0' + secs : secs);
	text(
		timeSpent,
		boardLeft + cols * imageSize - textWidth(timeSpent),
		boardTop - 15
	);
	image(
		imageWatch,
		boardLeft +
			cols * imageSize -
			textWidth(timeSpent) -
			imageWatch.width -
			10,
		boardTop - imageWatch.width - 10
	);
	buttonStart.position(
		boardLeft + (cols * imageSize - buttonStart.width) / 2,
		boardTop - buttonStart.height - 10
	);
	cellSize.position(
		boardLeft +
			(cols * imageSize - buttonStart.width) / 2 +
			buttonStart.width +
			10,
		boardTop - buttonStart.height + buttonStart.height / 2 - 5
	);
}

// function doubleClicked(event) {
// 	locationX = event.x;
// 	locationY = event.y;

// 	console.log(event);
// }
