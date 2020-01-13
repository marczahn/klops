import { BackendConnection, GameHandle, GameState, GameStateListener, Player } from '../models/game';

export const onGamesList = (onUpdate: (games: GameState[]) => void): ((event: string, data: string) => void) => {
    return (event: string, data: string) => {
        switch (event) {
            case 'game_added':
            case 'games_list':
                const games: GameState[] = JSON.parse(data)
                onUpdate(games)
        }
    }
}

export const createGame = async (conn: BackendConnection) => {
    conn.send('add_game', {})
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
    conn.send('send_state', null)
    return {
        addListener: (l: GameStateListener) => {
            listeners.push(l)
        },
        addPlayer: (p1: Player) => {
        },
        getState: (): Promise<GameState> => {
            const p = new Promise<GameState>((res, rej) => {
                if (gameState) {
                    res(gameState)
                    return
                }
                const listener = (event: string, data: string) => {
                    // game handle needs to receive each update so there is no check for the event
                    gameState = JSON.parse(data)
                    res(gameState)
                    conn.removeMessageListener(listener)
                }
                conn.addMessageListener(listener)
                conn.send('send_state', null)
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
            conn.send('quit_game', null)
        }
    }
}
