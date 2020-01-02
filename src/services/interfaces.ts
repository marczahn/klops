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
	readonly id: string
	readonly matrix: number[][]
	readonly cols: number
	readonly rows: number
	readonly status: string
	readonly counter: number
	readonly blockCount: number
	readonly nextBlock: number[][]

	readonly lineCount: number
	readonly points: number
	readonly level: number
	readonly name: string
}

export interface GameHandle {
	getState: () => ExternalGameState
	rotate: () => void
	moveLeft: () => void
	moveRight: () => void
	moveDown: () => void
	stop: () => void
	run: () => void
	pause: () => void
	addListener: (listener: (state: ExternalGameState, action: string) => void) => void
}

export interface GameProps {
	id: string
	cols: number
	rows: number
	name: string

}