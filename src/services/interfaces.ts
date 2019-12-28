export interface vector {
	x: number
	y: number
}

export interface block {
	zero: vector
	vectors: vector[]
	degrees: number
}

export interface ExternalGameState {
	matrix: number[][]
	cols: number
	rows: number
	ended: boolean
	lines: number
}

export interface GameControls {
	getGameState: () => ExternalGameState
	rotate: () => void
	moveLeft: () => void
	moveRight: () => void
	moveDown: () => void
	stopGame: () => void
}