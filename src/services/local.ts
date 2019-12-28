import {cloneDeep} from './clone'
import {getRandomBlockVector} from './blocks'
import {block, ExternalGameState, GameControls, vector} from './interfaces'

const emptyField = 0
const DOWN = 'down'
const LEFT = 'left'
const RIGHT = 'right'

export interface GameState {
	matrix: number[][]
	cols: number
	rows: number
	// active block exists as long as it can move by tetris rules
	activeBlock?: block
	ended: boolean
	lines: number
	interval: number
}

export const start = (cols: number, rows: number): GameControls => {
	let state: GameState = {
		matrix: createMarix(cols, rows),
		cols,
		rows,
		ended: false,
		lines: 0,
		interval: 0,
	}
	state.interval = window.setInterval(() => {
		state = updateGame(state)
	}, 500)
	return {
		getGameState: (): ExternalGameState => ({
			matrix: cloneDeep<number[][]>(state.matrix),
			rows: state.rows,
			cols: state.cols,
			lines: state.lines,
			ended: state.ended,
		}),
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
		stopGame: () => {
			state = stopGame(state)
		}
	}
}

const stopGame = (state: GameState): GameState => {
	window.clearInterval(state.interval)
	console.log('Game ended')
	const out = cloneDeep<GameState>(state)
	out.ended = true
	return out
}

const updateGame = (state: GameState): GameState => {
	return move(state, DOWN)
}

const move = (state: GameState, direction: string): GameState => {
	if (state.ended) {
		return state
	}
	const out = cloneDeep<GameState>(state)
	if (out.activeBlock == undefined) {
		out.activeBlock = createBlock(out.cols)
		const blocked = isBlocked(out.matrix, out.activeBlock)
		out.matrix = drawBlock(out.matrix, out.activeBlock)
		if (blocked) {
			return stopGame(out)
		}
		return out
	}
	const blockChecker = cloneDeep<block>(out.activeBlock)
	// Erase the active block so that we can reliably check if the new place is free
	out.matrix = eraseBlock(out.matrix, out.activeBlock)
	switch (direction) {
		case DOWN:
			blockChecker.zero.y++
			if (isBlocked(out.matrix, blockChecker)) {
				out.matrix = drawBlock(out.matrix, out.activeBlock)
				out.activeBlock = undefined
				// Check and Update lines
				return updateLines(out)
			}
			out.activeBlock.zero.y++
			break
		case RIGHT:
		case LEFT:
			blockChecker.zero.x += (direction === LEFT ? -1 : 1)
			if (isBlocked(out.matrix, blockChecker)) {
				out.matrix = drawBlock(out.matrix, out.activeBlock)

				return out
			}
			out.matrix = eraseBlock(out.matrix, out.activeBlock)
			out.activeBlock.zero.x += (direction === LEFT ? -1 : 1)
			break
	}
	out.matrix = drawBlock(out.matrix, out.activeBlock)

	return out
}

const updateLines = (state: GameState): GameState => {
	console.log('update lines')
	const foundLines: number[] = state.matrix.reduce(
		((acc: number[], row: number[], i: number) => {
			const lineComplete: boolean = row.reduce((acc: boolean, cell: number) => acc && cell !== emptyField, true)
			if (lineComplete) {
				acc.push(i)
			}
			return acc
		}),
		[],
	)
	if (foundLines.length === 0) {
		return state
	}
	const out = cloneDeep<GameState>(state)
	out.lines += foundLines.length
	const newMatrix = createMarix(out.matrix[0].length, foundLines.length)
	for (const row in state.matrix) {
		if (foundLines.includes(parseInt(row))) {
			continue
		}
		newMatrix.push(state.matrix[row])
	}
	out.matrix = newMatrix
	return out
}

const rotate = (state: GameState): GameState => {
	if (!state.activeBlock || state.ended) {
		return state
	}
	const out = cloneDeep(state)
	if (!out.activeBlock) {
		// This is just for avoid a typescript error at the check after resolveBlocking
		return out
	}
	let rotatedBlock = rotateBlockClockwise(state.activeBlock)
	eraseBlock(out.matrix, out.activeBlock)
	if (isBlocked(out.matrix, rotatedBlock)) {
		drawBlock(out.matrix, state.activeBlock)
		return state
	}
	out.activeBlock = rotatedBlock
	drawBlock(out.matrix, rotatedBlock)

	return out
}

export const rotateBlockClockwise = (block: block): block => {
	const maxYIndex = block.vectors.reduce((acc: number, v: vector): number => v.y > acc ? v.y : acc, 0)
	const maxXIndex = block.vectors.reduce((acc: number, v: vector): number => v.x > acc ? v.x : acc, 0)
	const vectors = block.vectors.map((v: vector): vector => ({x: maxYIndex - v.y, y: v.x}))

	const maxNewYIndex = vectors.reduce((acc: number, v: vector): number => v.y > acc ? v.y : acc, 0)
	const maxNewXIndex = vectors.reduce((acc: number, v: vector): number => v.x > acc ? v.x : acc, 0)

	// If we would use either floor or ceil only all the time
	// elements with a even number of fields would "move" to the left.
	// That way we use floor/ceil each 50/50
	const roundFn = block.degrees % 180 === 0 ? Math.ceil : Math.floor
	const xDistance = roundFn((maxNewXIndex - maxXIndex) / 2)
	const yDistance = roundFn((maxNewYIndex - maxYIndex) / 2)

	// We need to reposition zero because blocks are rotated around there upper right corner
	const zero = {
		x: block.zero.x - xDistance,
		y: block.zero.y - yDistance,
	}

	return {degrees: block.degrees + 90, zero: zero, vectors: vectors}
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

const eraseBlock = (matrix: number[][], block?: block): number[][] => {
	if (!block) {
		return matrix
	}
	toAbsVectors(block).forEach((v: vector) => {
		if (v.y >= 0 && v.x >= 0) {
			matrix[v.y][v.x] = emptyField
		}
	})

	return matrix
}

const drawBlock = (matrix: number[][], block: block): number[][] => {
	toAbsVectors(block).forEach((v: vector) => {
		if (v.y >= 0 && v.x >= 0) {
			matrix[v.y][v.x] = 1
		}
	})

	return matrix
}

const createBlock = (cols: number): block => {
	return {degrees: 0, zero: {x: Math.floor(cols / 2), y: 0}, vectors: getRandomBlockVector()}
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

const toAbsVectors = (block: block): vector[] => {
	return block.vectors.map((v: vector): vector => {
		return {x: block.zero.x + v.x, y: block.zero.y + v.y}
	})
}