import {cloneDeep} from './clone'

const emptyField = 0
const DOWN = 'down'
const LEFT = 'left'
const RIGHT = 'right'

interface coord {
	x: number
	y: number
}

interface piece {
	zero: coord
	fields: coord[]
}

export interface GameState {
	matrix: number[][]
	cols: number
	rows: number
	// active block exists as long as it can move by tetris rules
	activePiece?: piece

	lastMoveLeft: number
	lastMoveRight: number
	lastMoveDown: number
}

export interface GameControls {
	getGameState: () => GameState
	rotate: () => void
	moveLeft: () => void
	moveRight: () => void
	moveDown: () => void
}

export const start = (cols: number, rows: number): GameControls => {
	let state = {matrix: createMarix(cols, rows), cols, rows, lastMoveRight: 0, lastMoveLeft: 0, lastMoveDown: 0}
	window.setInterval(() => {
		state = updateGame(state)
	}, 500)
	return {
		getGameState: () => state,
		rotate: () => undefined,
		moveLeft: () => {
			state = move(state, LEFT)
		},
		moveRight: () => {
			state = move(state, RIGHT)
		},
		moveDown: () => {
			state = move(state, DOWN)
		},
	}
}
const updateGame = (state: GameState): GameState => {
	return move(state, DOWN)
}
const move = (state: GameState, direction: string): GameState => {
	const m = Date.now()
	if (m - state.lastMoveLeft < 50) {
		return state
	}
	const out = cloneDeep<GameState>(state)
	out.lastMoveLeft = m
	if (out.activePiece == undefined) {
		out.activePiece = createPiece(out.cols)
	}
	const blockChecker = cloneDeep<piece>(out.activePiece)
	switch (direction) {
		case DOWN:
			blockChecker.zero.y++
			if (isBlockedDown(blockChecker, out.matrix)) {
				out.activePiece = undefined
				return out
			}
			if (out.activePiece.zero.y >= 0) {
				out.matrix = erasePiece(out.matrix, out.activePiece)
			}
			out.activePiece.zero.y++
			out.matrix = drawPiece(out.matrix, out.activePiece)
			break
		case LEFT:
			blockChecker.zero.x--
			if (isBlockedLeft(blockChecker, out.matrix)) {
				return out
			}
			out.matrix = erasePiece(out.matrix, out.activePiece)
			out.activePiece.zero.x--
			out.matrix = drawPiece(out.matrix, out.activePiece)
			break
		case RIGHT:
			blockChecker.zero.x++
			if (isBlockedRight(blockChecker, out.matrix)) {
				return out
			}
			out.matrix = erasePiece(out.matrix, out.activePiece)
			out.activePiece.zero.x++
			out.matrix = drawPiece(out.matrix, out.activePiece)
			break
	}
	return out
}
const erasePiece = (matrix: number[][], piece?: piece): number[][] => {
	if (!piece) {
		return matrix
	}
	toAbsFields(piece).forEach((value: coord) => {
		matrix[value.y][value.x] = emptyField
	})
	return matrix
}
const drawPiece = (matrix: number[][], piece: piece): number[][] => {
	toAbsFields(piece).forEach((value: coord) => {
		matrix[value.y][value.x] = 1
	})
	return matrix
}
const isBlockedDown = (piece: piece, matrix: number[][]): boolean => {
	const lastRowIndex = matrix.length - 1
	return toAbsFields(piece).reduce(
			(acc: boolean, v: coord): boolean => {
				return acc || v.y > lastRowIndex || matrix[v.y][v.x] !== emptyField
			},
			false
	)
}
const isBlockedLeft = (piece: piece, matrix: number[][]): boolean => {
	return toAbsFields(piece).reduce(
			(acc: boolean, v: coord): boolean => {
				return acc || v.x < 0 || matrix[v.y][v.x] !== emptyField
			},
			false
	)
}
const isBlockedRight = (piece: piece, matrix: number[][]): boolean => {
	const lastColIndex = matrix[0].length - 1
	return toAbsFields(piece).reduce(
			(acc: boolean, v: coord): boolean => {
				return acc || v.x > lastColIndex || matrix[v.y][v.x] !== emptyField
			},
			false
	)
}
const createPiece = (cols: number): piece => {
	return {zero: {x: Math.floor(cols / 2), y: -1}, fields: [{x: 0, y: 0}]}
}
const createMarix = (cols: number, rows: number): number[][] => {
	const out: number[][] = []
	for (let y = 0; y < rows; y++) {
		const row: number[] = []
		for (let x = 0; x < cols; x++) {
			row.push(emptyField)
		}
		out.push(row)
	}
	return out
}
const toAbsFields = (piece: piece): coord[] => {
	return piece.fields.map((v: coord): coord => {
		return {x: piece.zero.x + v.x, y: piece.zero.y + v.y}
	})
}