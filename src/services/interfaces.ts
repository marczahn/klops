export interface vector {
	x: number
	y: number
}

export interface block {
	zero: vector
	vectors: vector[]
	degrees: number
}

export interface GameState {
	matrix: number[][]
	cols: number
	rows: number
	// active block exists as long as it can move by tetris rules
	activeBlock?: block
	ended: boolean
}

export interface GameControls {
	getGameState: () => GameState
	rotate: () => void
	moveLeft: () => void
	moveRight: () => void
	moveDown: () => void
}