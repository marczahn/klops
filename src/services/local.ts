const emptyField = 0

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
	let state = {matrix: createMarix(cols, rows), cols, rows}
	window.setInterval(() => {
		state = update(state)
	}, 500)
	return {
		getGameState: () => state,
		rotate: () => undefined,
		moveLeft: () => undefined,
		moveRight: () => undefined,
		moveDown: () => undefined,
	}
}
const update = (state: GameState): GameState => {
	const out = Object.assign({}, state)
	if (out.activePiece == undefined) {
		out.activePiece = createPiece(out.cols)
	}
	if (isBlocked(out.activePiece, out.matrix)) {
		out.activePiece = undefined
		return out
	}
	const ap = out.activePiece
	// First: remove active block from matrix by setting belonging fields to zero
	if (ap.zero.y > -1) {
		// Not started yet
		ap.fields.forEach((value: coord) => {
			out.matrix[ap.zero.y + value.y][ap.zero.x + value.x] = emptyField
		})
	}
	// Second: move piece and readd it to matrix
	ap.zero.y++
	ap.fields.forEach((value: coord) => {
		out.matrix[ap.zero.y + value.y][ap.zero.x + value.x] = 1
	})
	out.activePiece = ap
	return out
}
const isBlocked = (piece: piece, matrix: number[][]): boolean => {
	const lastRowIndex = matrix.length - 1
	return toAbsFields(piece).reduce(
			(acc: boolean, v: coord): boolean => {
				const x = piece.zero.x + v.x
				const y = piece.zero.y + v.y
				if (acc) {
					return acc
				}
				return v.y === lastRowIndex || matrix[v.y + 1][v.x] !== emptyField
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