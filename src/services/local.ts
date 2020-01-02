import {cloneDeep, uuidv4} from './utils'
import {blockVectorFactory} from './blocks'
import {block, ExternalGameState, GameHandle, GameProps, vector} from './interfaces'

const emptyField = 0
const DOWN = 'down'
const LEFT = 'left'
const RIGHT = 'right'
const ROTATE = 'rotate'
export const LOOPED = 'looped'

export const blockCreated = 'blockCreated'
export const linesCompleted = 'linesCompleted'
export const statusChanged = 'statusChanged'

export const statusWaiting = 'waiting'
export const statusRunning = 'running'
export const statusEnded = 'ended'
export const statusPaused = 'paused'

const LEVEL_THRESHOLD = 10
const BASE_LOOP_INTERVAL = 600

// The divider defines the acceleration per level - The lower the quicker increases the speed. 8 feels tetris'ish
const LOOP_INTERVAL_DIVIDER = 6

interface GameState {
	readonly id: string
	matrix: number[][]
	cols: number
	rows: number
	// active block exists as long as it can move by tetris rules
	activeBlock?: block
	nextBlock: block
	status: string
	loopInterval: number
	stepCounter: number
	blockCount: number
	// used for rendering, scores etc
	listeners: ((state: ExternalGameState, action: string) => void)[]
	userQueue: string[]
	blockFactory: (zero: vector) => block

	lineCount: number
	points: number
	level: number
	lastLoopIteration: number
	name: string
}

export const create = (props: GameProps): GameHandle => {
	const blockFactory = blockVectorFactory()
	let state: GameState = {
		id: props.id,
		matrix: createMatrix(props.cols, props.rows),
		cols: props.cols,
		rows: props.rows,
		status: statusWaiting,
		loopInterval: -1,
		stepCounter: 0,
		blockCount: 0,
		listeners: [],
		userQueue: [],
		blockFactory: blockVectorFactory(),
		nextBlock: createBlock(props.cols, blockFactory),
		lastLoopIteration: 0,
		name: props.name,

		lineCount: 0,
		points: 0,
		level: 1
	}
	const setState = (newState: GameState) => {
		state = newState
	}
	const getState = (): GameState => state
	// For some reason when I move the userQueue stuff into a separate function we run into heavy performance issues on rotating
	const start = () => {
		if (state.status === statusEnded) {
			throw 'Game ended already'
		}
		window.clearInterval(state.loopInterval)
		state.loopInterval = window.setInterval(() => {
			if (state.userQueue.length > 0) {
				while (true) {
					const action = state.userQueue.shift()
					if (!action) {
						break
					}
					switch (action) {
						case ROTATE:
							state = rotate(state)
							break
						case LEFT:
						case RIGHT:
						case DOWN:
							state = move(state, action)
							break
					}
				}
				publish(state, LOOPED)
				return
			}
			loop(getState, setState)
			publish(state, LOOPED)
		}, 10)
		state.status = statusRunning
	}

	const pause = () => {
		if (state.status !== statusRunning) {
			return
		}
		window.clearInterval(state.loopInterval)
		state.status = statusPaused
	}

	return {
		getState: (): ExternalGameState => toExternalGameState(state),
		rotate: () => {
			state.userQueue.push(ROTATE)
		},
		moveLeft: () => {
			state.userQueue.push(LEFT)
		},
		moveRight: () => {
			state.userQueue.push(RIGHT)
		},
		moveDown: () => {
			state.userQueue.push(DOWN)
		},
		stop: () => {
			state = stop(state)
		},
		run: () => {
			start()
		},
		pause: () => {
			pause()
		},
		addListener: (listener: (state: ExternalGameState, action: string) => void) => {
			state = addListener(state, listener)
		}
	}
}

const loop = (getState: () => GameState, setState: (state: GameState) => void) => {
	const now = Date.now()
	const state = getState()
	if (
		state.status !== statusRunning ||
		now - state.lastLoopIteration < calculateLoopInterval(BASE_LOOP_INTERVAL, LOOP_INTERVAL_DIVIDER, state.level)
	) {
		return
	}
	state.lastLoopIteration = now
	const out = move(state, DOWN)
	publish(out, LOOPED)
	setState(out)
}

const calculateLoopInterval = (baseInterval: number, intervalDivider: number, level: number): number =>
	baseInterval * (1 - (level / intervalDivider))

const toExternalGameState = (state: GameState): ExternalGameState => ({
	id: state.id,
	matrix: cloneDeep<number[][]>(state.matrix),
	rows: state.rows,
	cols: state.cols,
	lineCount: state.lineCount,
	status: state.status,
	counter: state.stepCounter,
	blockCount: state.blockCount,
	nextBlock: convertBlockToMatrix(state.nextBlock),
	level: state.level,
	points: state.points,
	name: state.name,
})

const convertBlockToMatrix = (block: block): number[][] => {
	const maxYIndex = block.vectors.reduce((acc: number, v: vector): number => v.y > acc ? v.y : acc, 0)
	const maxXIndex = block.vectors.reduce((acc: number, v: vector): number => v.x > acc ? v.x : acc, 0)
	const out: number[][] = []
	for (let y = 0; y <= maxYIndex; y++) {
		const row = []
		for (let x = 0; x <= maxXIndex; x++) {
			row.push(emptyField)
		}
		out.push(row)
	}
	block.vectors.forEach((v: vector) => {
		out[v.y][v.x] = 1
	})

	return out
}

const addListener = (state: GameState, listener: (state: ExternalGameState, action: string) => void): GameState => {
	const out = cloneDeep<GameState>(state)
	out.listeners.push(listener)

	return out
}

const publish = (state: GameState, action: string) => {
	const out = toExternalGameState(state)
	state.listeners.forEach(listener => listener(out, action))
}

const stop = (state: GameState): GameState => {
	window.clearInterval(state.loopInterval)
	console.log('Game ended')
	const out = cloneDeep<GameState>(state)
	out.status = statusEnded
	publish(out, statusChanged)
	return out
}

const move = (state: GameState, direction: string): GameState => {
	if (state.status !== statusRunning) {
		return state
	}
	const out = cloneDeep<GameState>(state)
	out.stepCounter++
	if (out.activeBlock === undefined) {
		return initNextBlock(out)
	}
	const blockChecker = cloneDeep<block>(out.activeBlock)
	// Erase the active block so that we can reliably check if the new place is free
	out.matrix = eraseBlock(out.matrix, out.activeBlock)
	switch (direction) {
		case DOWN:
			blockChecker.zero.y++
			// TODO - check additionally to isBlocke if lowest point of block reached the last line to skip the "invisible" step
			if (isBlocked(out.matrix, blockChecker)) {
				out.matrix = drawBlock(out.matrix, out.activeBlock)
				out.activeBlock = undefined

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

const initNextBlock = (state: GameState): GameState => {
	const out = cloneDeep<GameState>(state)
	out.activeBlock = out.nextBlock
	out.nextBlock = createBlock(out.cols, state.blockFactory)
	out.blockCount++
	const blocked = isBlocked(out.matrix, out.activeBlock)
	out.matrix = drawBlock(out.matrix, out.activeBlock)
	publish(out, blockCreated)
	if (blocked) {
		return stop(out)
	}

	return out
}

const updateLines = (state: GameState): GameState => {
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
	out.lineCount += foundLines.length
	out.level = Math.floor(out.lineCount / LEVEL_THRESHOLD)
	debugger
	out.points += calculatePoints(foundLines.length, out.level)
	publish(out, linesCompleted)

	out.matrix = dropLinesFromMatrix(state.matrix, foundLines)
	return out
}

const dropLinesFromMatrix = (matrix: number[][], foundLines: number[]): number[][] => {
	const newMatrix = createMatrix(matrix[0].length, foundLines.length)
	for (const row in matrix) {
		if (foundLines.includes(parseInt(row))) {
			continue
		}
		newMatrix.push(matrix[row])
	}
	return newMatrix
}

const calculatePoints = (foundLines: number, level: number): number => {
	let basePoints = 0
	switch (foundLines) {
		case 1:
			basePoints = 40
			break
		case 2:
			basePoints = 100
			break
		case 3:
			basePoints = 300
			break
		case 4:
			basePoints = 1200
			break
		default:
			// Not more points for now
			basePoints = 1500
			break
	}
	return basePoints * (level + 1)
}

const rotate = (state: GameState): GameState => {
	if (!state.activeBlock || state.status !== statusRunning) {
		return state
	}
	const out = cloneDeep(state)
	out.stepCounter++
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

	// We need to reposition zero because blockCount are rotated around there upper right corner and not around their center
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

const createBlock = (cols: number, blockFactory: (zero: vector) => block): block => {
	return blockFactory({x: Math.floor(cols / 2), y: 0})
}

export const createMatrix = (cols: number, rows: number): number[][] => {
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