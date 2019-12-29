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
	lineCount: number
	counter: number
	blockCount: number
}

export interface GameControls {
	getGameState: () => ExternalGameState
	rotate: () => void
	moveLeft: () => void
	moveRight: () => void
	moveDown: () => void
	stopGame: () => void
	addListener: (listener: (state: ExternalGameState, action: string) => void) => void
}