// Those interfaces are only used for external usage. For internal usage there is another one.
export type GameStateListener = (state: GameState, event: string) => void

export interface GameState {
    id: string
    owner: string
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

export interface Participant {
    id: string
    name: string
    points: number
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
    send: <T>(command: string, data?: any, timeout?: number) => Promise<T>
    sendIgnore: (command: string, data?: any) => void
    close: () => void
}

export interface Player {
    name: string
    id: string
}

export enum GameEvents {
    started = 'started',
    looped = 'looped',
    blockCreated = 'blockCreated',
    linesCompleted = 'linesCompleted',
    statusChanged = 'statusChanged',
    roundDone = 'roundDone',
    stopped = 'stopped',
    nextBlockCreated = 'nextBlockCreated',
    playerAdded = 'playerAdded',
    playerRemoved = 'playerRemoved',
    configUpdated = 'configUpdated',
}
