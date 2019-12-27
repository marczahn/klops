import {cloneDeep} from './clone'
import {getRandomBlockVector} from './blocks'

const emptyField = 0
const DOWN = 'down'
const LEFT = 'left'
const RIGHT = 'right'

interface vector {
	x: number
	y: number
}

interface block {
	zero: vector
	vectors: vector[]
}

export interface GameState {
	matrix: number[][]
	cols: number
	rows: number
	// active block exists as long as it can move by tetris rules
	activeBlock?: block
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
	if (out.activeBlock == undefined) {
		out.activeBlock = createBlock(out.cols)
	}
	const blockChecker = cloneDeep<block>(out.activeBlock)
	if (out.activeBlock) {
		// Erase first so that we can reliably check if the new place is free
		out.matrix = erasePiece(out.matrix, out.activeBlock)
	}
	switch (direction) {
		case DOWN:
			blockChecker.zero.y++
			if (isBlocked(out.matrix, blockChecker)) {
				out.matrix = drawPiece(out.matrix, out.activeBlock)
				out.activeBlock = undefined
				return out
			}
			out.activeBlock.zero.y++
			out.matrix = drawPiece(out.matrix, out.activeBlock)
			break
		case RIGHT:
		case LEFT:
			blockChecker.zero.x += (direction === LEFT ? -1 : 1)
			if (isBlocked(out.matrix, blockChecker)) {
				out.matrix = drawPiece(out.matrix, out.activeBlock)
				return out
			}
			out.matrix = erasePiece(out.matrix, out.activeBlock)
			out.activeBlock.zero.x += (direction === LEFT ? -1 : 1)
			out.matrix = drawPiece(out.matrix, out.activeBlock)
			break
	}
	return out
}
const erasePiece = (matrix: number[][], piece?: block): number[][] => {
	if (!piece) {
		return matrix
	}
	toAbsVectors(piece).forEach((v: vector) => {
		if (v.y >= 0 && v.x >= 0) {
			matrix[v.y][v.x] = emptyField
		}
	})
	return matrix
}
const drawPiece = (matrix: number[][], piece: block): number[][] => {
	toAbsVectors(piece).forEach((v: vector) => {
		if (v.y >= 0 && v.x >= 0) {
			matrix[v.y][v.x] = 1
		}
	})
	return matrix
}
const rotate = (state: GameState): GameState => {
	if (!state.activeBlock) {
		return state
	}
	const out = cloneDeep(state)
	if (!out.activeBlock) {
		// This is just for avoid a typescript error at the check after resolveBlocking
		return out
	}
	let rotatedPiece = rotateBlockClockwise(state.activeBlock)
	erasePiece(out.matrix, out.activeBlock)
	if (isBlocked(out.matrix, rotatedPiece)) {
		rotatedPiece = resolveBlocking(out.matrix, rotatedPiece)
		if (rotatedPiece.zero.x === out.activeBlock.zero.x && rotatedPiece.zero.y === out.activeBlock.zero.y) {
			return state
		}
	}
	out.activeBlock = rotatedPiece
	drawPiece(out.matrix, rotatedPiece)
	return out
}
const resolveBlocking = (matrix: number[][], block: block): block => {
	return block
}
const rotateBlockClockwise = (block: block): block => {
	const maxYIndex = block.vectors.reduce((acc: number, v: vector): number => v.y > acc ? v.y : acc, 0)
	return {zero: block.zero, vectors: block.vectors.map((v: vector): vector => ({x: maxYIndex - v.y, y: v.x}))}
}
const isBlocked = (matrix: number[][], piece: block): boolean => {
	const lastRowIndex = matrix.length - 1
	const lastColIndex = matrix[0].length - 1
	return toAbsVectors(piece).reduce(
		(acc: boolean, v: vector): boolean => {
			return acc ||
				v.x < 0 ||
				v.y > lastRowIndex ||
				v.x > lastColIndex ||
				(v.y >= 0 && matrix[v.y][v.x] !== emptyField)
		},
		false
	)
}
const createBlock = (cols: number): block => {
	return {zero: {x: Math.floor(cols / 2), y: -2}, vectors: getRandomBlockVector()}
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
const toAbsVectors = (piece: block): vector[] => {
	return piece.vectors.map((v: vector): vector => {
		return {x: piece.zero.x + v.x, y: piece.zero.y + v.y}
	})
}