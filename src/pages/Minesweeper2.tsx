import { DeserializeStateFn, Page, RenderedPage } from "slashasaurus";

enum CellTypes {
	EMPTY = "0️⃣",
	ONE = "1️⃣",
	TWO = "2️⃣",
	THREE = "3️⃣",
	FOUR = "4️⃣",
	FIVE = "5️⃣",
	SIX = "6️⃣",
	SEVEN = "7️⃣",
	EIGHT = "8️⃣",
	MINE = "💥",
	HIGHLIGHTED = "🟨",
	FLAG = "🚩",
	HIDDEN = "⬛",
}

interface Cell {
	type: CellTypes;
	revealed: boolean;
	flagged: boolean;
}

function randomBetween(low: number, high: number) {
	return Math.floor(Math.random() * (high - low + 1)) + low;
}

function countToCellType(count: number) {
	switch (count) {
		case 0:
			return CellTypes.EMPTY;
		case 1:
			return CellTypes.ONE;
		case 2:
			return CellTypes.TWO;
		case 3:
			return CellTypes.THREE;
		case 4:
			return CellTypes.FOUR;
		case 5:
			return CellTypes.FIVE;
		case 6:
			return CellTypes.SIX;
		case 7:
			return CellTypes.SEVEN;
		case 8:
			return CellTypes.EIGHT;
		default:
			throw new Error(`Invalid count: ${count}`);
	}
}

const map = new Map<string, Minesweeper2>();

export function getPlayerMap(id: string) {
	if (map.has(id)) {
		return map.get(id);
	}
	return undefined;
}

export function setPlayerMap(id: string, board: Minesweeper2) {
	map.set(id, board);
}

export default class Minesweeper2 extends Page<
	{},
	{
		board: Cell[][];
		highlightedCell: [number, number] | null;
		inAutocomplete: boolean;
		ended: boolean;
	}
> {
	static pageId = "dbl";

	timer: ReturnType<typeof setTimeout>;
	boardTimer: ReturnType<typeof setTimeout>;

	constructor() {
		super({});
		this.getDisplayedBoard = this.getDisplayedBoard.bind(this);
		this.setHighlightedCell = this.setHighlightedCell.bind(this);
		this.startAutocompleteSession = this.startAutocompleteSession.bind(this);
		const board = Minesweeper2.generateBoard(6, 6, 4);
		this.state = {
			board,
			highlightedCell: null,
			inAutocomplete: false,
			ended: false,
		};
	}

	static generateBoard(width: number, height: number, mines: number) {
		// Step 1, fill the board with empty cells
		const board: Cell[][] = [];
		for (let i = 0; i < height; i++) {
			let row: Cell[] = [];
			for (let j = 0; j < width; j++) {
				row.push({
					type: CellTypes.EMPTY,
					revealed: false,
					flagged: false,
				});
			}
			board.push(row);
		}
		// Step 2, randomly place mines
		let locations: [number, number][] = [];
		for (let i = 0; i < mines; i++) {
			let x = randomBetween(0, width - 1);
			let y = randomBetween(0, height - 1);
			while (locations.find((l) => l[0] === x && l[1] === y)) {
				x = randomBetween(0, width - 1);
				y = randomBetween(0, height - 1);
			}
			locations.push([x, y]);
		}
		// Step 3, set the mines
		locations.forEach((l) => {
			board[l[1]][l[0]].type = CellTypes.MINE;
		});
		// Step 4, set the numbers
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				if (board[i][j].type !== CellTypes.MINE) {
					let count = 0;
					for (let x = i - 1; x <= i + 1; x++) {
						for (let y = j - 1; y <= j + 1; y++) {
							if (x >= 0 && x < height && y >= 0 && y < width) {
								if (board[x][y].type === CellTypes.MINE) {
									count++;
								}
							}
						}
					}
					board[i][j].type = countToCellType(count);
				}
			}
		}
		return board;
	}

	/**
	 * This function takes human coordinates (1 indexed) and converts them to board coordinates (0 indexed)
	 *
	 * @param x The x coordinate of the cell to reveal
	 * @param y The y coordinate of the cell to reveal
	 */
	setHighlightedCell(x: number, y: number) {
		if (
			x > 0 &&
			x <= this.state.board[0].length &&
			y > 0 &&
			y <= this.state.board.length
		) {
			this.setState({
				highlightedCell: [y - 1, x - 1],
			});
		}
	}

	flagCell(x: number, y: number) {
		const board = this.state.board;
		board[y - 1][x - 1].flagged = !board[y - 1][x - 1].flagged;
		this.setState({
			board,
			inAutocomplete: false,
			highlightedCell: null,
		});
	}

	revealCell(x: number, y: number) {
		if (
			x === 0 ||
			y === 0 ||
			x > this.state.board[0].length ||
			y > this.state.board.length
		)
			return;
		const board = this.state.board;
		if (board[y - 1][x - 1].revealed) return;
		if (board[y - 1][x - 1].type === CellTypes.MINE) {
			// Game over
			this.setState({
				ended: true,
				inAutocomplete: false,
				highlightedCell: null,
			});
			return;
		}
		board[y - 1][x - 1].revealed = true;
		if (board[y - 1][x - 1].type === CellTypes.EMPTY) {
			// Reveal all the cells around this one
			for (let i = y - 1; i <= y + 1; i++) {
				for (let j = x - 1; j <= x + 1; j++) {
					this.recursivelyReveal(j, i, board);
				}
			}
		}
		this.setState({
			board,
			inAutocomplete: false,
			highlightedCell: null,
		});
	}

	recursivelyReveal(x: number, y: number, board: Cell[][]) {
		if (
			x === 0 ||
			y === 0 ||
			x > this.state.board[0].length ||
			y > this.state.board.length
		)
			return;
		if (board[y - 1][x - 1].revealed) return;
		board[y - 1][x - 1].revealed = true;
		if (board[y - 1][x - 1].type === CellTypes.EMPTY) {
			// Reveal all the cells around this one
			for (let i = y - 1; i <= y + 1; i++) {
				for (let j = x - 1; j <= x + 1; j++) {
					this.recursivelyReveal(j, i, board);
				}
			}
		}
	}

	startAutocompleteSession() {
		if (!this.state.inAutocomplete) {
			this.setState({ inAutocomplete: true });
		}
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			this.setState({ inAutocomplete: false, highlightedCell: null });
		}, 5000);
	}

	serializeState() {
		return JSON.stringify(this.state);
	}

	getDisplayedBoard() {
		const { board, highlightedCell, inAutocomplete, ended } = this.state;
		const grid = board
			.map((row, rowIndex) => {
				return row
					.map((cell, cellIndex) => {
						let text = "";
						if (
							highlightedCell &&
							cellIndex === highlightedCell[0] &&
							rowIndex === highlightedCell[1]
						) {
							text = CellTypes.HIGHLIGHTED;
						} else if (cell.revealed || ended) {
							text = cell.type;
						} else if (cell.flagged) {
							text = CellTypes.FLAG;
						} else {
							text = CellTypes.HIDDEN;
						}
						return `[${text}](https://6d69-96-87-103-193.ngrok.io/?x=${
							cellIndex + 1
						}&y=${rowIndex + 1})`;
					})
					.join("");
			})
			.join("\n");
		if (inAutocomplete) {
			return grid + "\n\n\n\n\n.";
		}
		return grid;
	}

	render(): RenderedPage {
		return {
			content: this.getDisplayedBoard(),
		};
	}
}

export const deserializeState: DeserializeStateFn<{}, {}> = (
	serializedState
) => {
	const state = JSON.parse(serializedState);
	return {
		props: {},
		state,
	};
};
