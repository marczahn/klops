import { BackendConnection, GameState } from '../models/game';

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
