class Cell {
	constructor(x, y, row, col) {
		this.x = x;
		this.y = y;
		this.row = row;
		this.col = col;
		this.bombs = 0;
		this.isBomb = false;
		this.revealed = false;
		this.bombFlag = false;
	}

	init() {
		this.bombs = 0;
		this.isBomb = false;
		this.revealed = false;
		this.bombFlag = false;
	}

	reveal() {
		if (this.revealed) return true;
		this.revealed = true;
		if (this.isBomb) return false;
		return true;
	}

	draw() {
		if (this.revealed) {
			if (this.isBomb) {
				image(
					imageBombRed,
					this.x + this.col * imageSize,
					this.y + this.row * imageSize
				);
			} else {
				image(
					imageNumbers[this.bombs],
					this.x + this.col * imageSize,
					this.y + this.row * imageSize
				);
			}
		} else if (this.bombFlag) {
			image(
				imageBombFlag,
				this.x + this.col * imageSize,
				this.y + this.row * imageSize
			);
		} else {
			image(
				imageUntouch,
				this.x + this.col * imageSize,
				this.y + this.row * imageSize
			);
		}
	}

	showBombs(imageBombRed, imageBombFlag) {
		if (this.isBomb) {
			if (this.bombFlag) {
				image(
					imageBombFlag,
					this.x + this.col * imageSize,
					this.y + this.row * imageSize
				);
			} else if (this.revealed) {
				image(
					imageBombRed,
					this.x + this.col * imageSize,
					this.y + this.row * imageSize
				);
			} else {
				image(
					imageBomb,
					this.x + this.col * imageSize,
					this.y + this.row * imageSize
				);
			}
		} else if (this.revealed) {
			image(
				imageNumbers[this.bombs],
				this.x + this.col * imageSize,
				this.y + this.row * imageSize
			);
		} else if (this.bombFlag) {
			image(
				imageBombWrong,
				this.x + this.col * imageSize,
				this.y + this.row * imageSize
			);
		} else {
			image(
				imageUntouch,
				this.x + this.col * imageSize,
				this.y + this.row * imageSize
			);
		}
	}
}
