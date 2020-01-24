import { BackendConnection, GameHandle, GameState, GameStateListener, Player } from '../models/game';

export const onGamesList = (onUpdate: (games: GameState[]) => void): ( (event: string, data: string) => void ) => {
    return (event: string, data: string) => {
        switch (event) {
            case 'game_added':
            case 'games_list':
                const games: GameState[] = JSON.parse(data)
                onUpdate(games)
        }
    }
}

export const moveLeft = (conn: BackendConnection) => {
    conn.sendIgnore('move_left')
}

export const moveDown = (conn: BackendConnection) => {
    conn.sendIgnore('move_down')
}

export const moveRight = (conn: BackendConnection) => {
    conn.sendIgnore('move_right')
}

export const rotate = (conn: BackendConnection) => {
    conn.sendIgnore('rotate')
}

export const startGame = async (conn: BackendConnection): Promise<GameState> => {
    return conn.send<GameState>('start_game')
}

export const createGame = async (conn: BackendConnection): Promise<GameState> => {
    return conn.send<GameState>('create_game')
}

export const enterGame = async (conn: BackendConnection, gameId: string): Promise<string> => {
    return conn.send<string>('enter_game', gameId)
}

export const getGameHandle = (conn: BackendConnection): GameHandle => {
    let gameState: GameState
    const listeners: GameStateListener[] = []
    const listener = (event: string, data: string) => {
        gameState = JSON.parse(data)
        listeners.forEach(l => l(gameState, event))
    }
    const closeListener = (event: WebSocketCloseEvent) => {
        listeners.forEach(l => l(gameState, 'disconnected'))
    }
    conn.addMessageListener(listener)
    conn.addCloseListener(closeListener)
    // Now we initialize the game state by requesting the current gamestate - send_state does not need any data
    // since the connection is alray bound to a game
    return {
        addListener: (l: GameStateListener) => {
            listeners.push(l)
        },
        addPlayer: (p1: Player) => {
        },
        getState: (): Promise<GameState> => {
            const p = new Promise<GameState>(async (res, rej) => {
                if (gameState) {
                    res(gameState)
                    return
                }
                try {
                    res(await conn.send<GameState>('send_state'))
                } catch (e) {
                    rej(e)
                }
            })
            return p
        },
        moveDown: () => {
        },
        moveLeft: () => {
        },
        moveRight: () => {
        },
        rotate: () => {
        },
        start: () => {
        },
        stop: () => {
        },
        config: (cols: number, rows: number, name: string) => {
            if (gameState) {
                conn.send('config_game', { cols, rows, name })
            }
        },
        disconnect: () => {
            conn.removeMessageListener(listener)
            conn.removeCloseListener(closeListener)
        },
        quit: () => {
            conn.send('quit_game')
        }
    }
}
