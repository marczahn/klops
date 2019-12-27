import {cloneDeep} from './clone'
import {dir} from 'tmp'

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
}

export interface GameControls {
	getGameState: () => GameState
	rotate: () => void
	moveLeft: () => void
	moveRight: () => void
	moveDown: () => void
}

export const start = (cols: number, rows: number): GameControls => {
	let state: GameState = {
		matrix: createMarix(cols, rows),
		cols,
		rows,
	}
	window.setInterval(() => {
		state = updateGame(state)
	}, 500)
	return {
		getGameState: () => state,
		rotate: () => {
			state = rotate(state)
		},
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
	const out = cloneDeep<GameState>(state)
	if (out.activePiece == undefined) {
		out.activePiece = createPiece(out.cols)
	}
	const blockChecker = cloneDeep<piece>(out.activePiece)
	if (out.activePiece) {
		// Erase first so that we can reliably check if the new place is free
		out.matrix = erasePiece(out.matrix, out.activePiece)
	}
	switch (direction) {
		case DOWN:
			blockChecker.zero.y++
			if (isBlocked(out.matrix, blockChecker)) {
				out.matrix = drawPiece(out.matrix, out.activePiece)
				out.activePiece = undefined
				return out
			}
			out.activePiece.zero.y++
			out.matrix = drawPiece(out.matrix, out.activePiece)
			break
		case RIGHT:
		case LEFT:
			if (direction === LEFT) {
				blockChecker.zero.x--
			} else {
				blockChecker.zero.x++
			}

			if (isBlocked(out.matrix, blockChecker)) {
				out.matrix = drawPiece(out.matrix, out.activePiece)
				return out
			}
			out.matrix = erasePiece(out.matrix, out.activePiece)
			if (direction === LEFT) {
				out.activePiece.zero.x--
			} else {
				out.activePiece.zero.x++
			}
			out.matrix = drawPiece(out.matrix, out.activePiece)
			break
	}
	return out
}
const erasePiece = (matrix: number[][], piece?: piece): number[][] => {
	if (!piece) {
		return matrix
	}
	toAbsFields(piece).forEach((v: coord) => {
		if (v.y >= 0 && v.x >= 0) {
			matrix[v.y][v.x] = emptyField
		}
	})
	return matrix
}
const drawPiece = (matrix: number[][], piece: piece): number[][] => {
	toAbsFields(piece).forEach((v: coord) => {
		if (v.y >= 0 && v.x >= 0) {
			matrix[v.y][v.x] = 1
		}
	})
	return matrix
}

const rotate = (state: GameState): GameState => {
	if (!state.activePiece) {
		return state
	}
	const out = cloneDeep(state)
	const rotatedPiece = rotatePiece(state.activePiece)
	erasePiece(out.matrix, out.activePiece)
	if (isBlocked(out.matrix, rotatedPiece)) {
		return state
	}
	out.activePiece = rotatedPiece
	drawPiece(out.matrix, rotatedPiece)
	return out
}

const rotatePiece = (piece: piece): piece => {
	// Create quadratic matrix
	const maxXIndex = piece.fields.reduce((acc: number, v: coord): number => v.x > acc ? v.x : acc, 0)
	const maxYIndex = piece.fields.reduce((acc: number, v: coord): number => v.y > acc ? v.y : acc, 0)
	const src: number[][] = []
	for (let y = 0; y <= maxYIndex; y++) {
		let row = []
		for (let x = 0; x <= maxXIndex; x++) {
			row.push(0)
		}
		src.push(row)
	}
	const dst: number[][] = []
	for (let y = 0; y <= maxYIndex; y++) {
		let row = []
		for (let x = 0; x <= maxXIndex; x++) {
			row.push(0)
		}
		dst.push(row)
	}
	piece.fields.forEach((v: coord) => {
		src[v.y][v.x] = 1
	})
	let fields: coord[] = []
	let out: piece = {zero: piece.zero, fields: fields}

	for (let y = 0; y <= maxYIndex; y++) {
		for (let x = 0; x <= maxXIndex; x++) {
			dst[x][maxYIndex - y] = src[y][x]
		}
	}
	for (let y = 0; y <= maxYIndex; y++) {
		for (let x = 0; x <= maxXIndex; x++) {
			if (dst[y][x] !== 0) {
				out.fields.push({x: x, y: y})
			}
		}
	}
	return out
}
const isBlocked = (matrix: number[][], piece: piece): boolean => {
	const lastRowIndex = matrix.length - 1
	const lastColIndex = matrix[0].length - 1
	return toAbsFields(piece).reduce(
			(acc: boolean, v: coord): boolean => {
				return acc ||
						v.x < 0 ||
						v.y > lastRowIndex ||
						v.x > lastColIndex ||
						(v.y >= 0 && matrix[v.y][v.x] !== emptyField)
			},
			false
	)
}
const createPiece = (cols: number): piece => {
	const fields = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}]
	return {zero: {x: Math.floor(cols / 2), y: -2}, fields: fields}
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