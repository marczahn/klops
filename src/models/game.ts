// Those interfaces are only used for external usage. For internal usage there is another one.
export type GameStateListener = (state: GameState, event: string) => void

export interface GameState {
    id: string
    cols: number
    name: string
    rows: number
    status: string
    matrix: Matrix
    blockCount: number
    nextBlock?: Block
    activeBlock?: Block
    lineCount?: number
    players: Player[]
    currentPlayer: string
    level: number
    stepCount: number // is the amount of steps that have been done so far (movements, rotates, etc.)
}

export interface GameHandle {
    getState: () => Promise<GameState>
    moveLeft: () => void
    moveRight: () => void
    moveDown: () => void
    rotate: () => void
    start: () => void
    stop: () => void
    addListener: (l: GameStateListener) => void
    addPlayer: (p: Player) => void
    disconnect: () => void
    config: (cols: number, rows: number, name: string) => void
    quit: () => void
}

export type Matrix = number[][]

export interface Vector {
    x: number
    y: number
}

export interface Block {
    zero: Vector
    vectors: Vector[]
    degrees: number
}

export interface Player {
    name: string
    points: number
}

export type MessageListener = (event: string, data: string) => void
export type CloseListener = (event: WebSocketCloseEvent) => void

export interface BackendConnection {
    addMessageListener: (l: MessageListener) => void
    removeMessageListener: (l: MessageListener) => void
    addCloseListener: (l: CloseListener) => void
    removeCloseListener: (l: CloseListener) => void
    send: (event: string, data: any) => void
    close: () => void
}
