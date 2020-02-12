import React, { FC, useContext, useEffect, useState } from 'react'
import { looped } from '../../services/local'
import PrintMatrix from '../shared/PrintMatrix'
import { BackendConnection, GameState } from '../../models/game';
import ConnectionContext from '../../services/backend';
import { moveDown, moveLeft, moveRight, rotate } from '../../services/game';

interface Props {
    initialGameState: GameState
}

const Board: FC<Props> = (props: Props) => {
    const conn = useContext<BackendConnection>(ConnectionContext)
    const [gameState, setGameState] = useState<GameState>()
    // counter is used to trigger a rendering of the matrix
    const [_, setCounter] = useState<number>(0)

    const handleArrowPress = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'ArrowRight':
                moveRight(conn)
                break
            case 'ArrowLeft':
                moveLeft(conn)
                break
            case 'ArrowDown':
                moveDown(conn)
                break
            case 'ArrowUp':
                rotate(conn)
                break
        }
    }

    const listener = (event: string, data: string) => {
        let state: GameState
        switch (event) {
            case looped:
                state = JSON.parse(data)
                console.log(state)
                setGameState(state)
                setCounter(state.stepCount)
                break
        }
    }

    useEffect(() => {
            setGameState(props.initialGameState)
            setCounter(props.initialGameState.stepCount)
            conn.addMessageListener(listener)
            document.addEventListener('keydown', handleArrowPress)
            return () => {
                conn.removeMessageListener(listener)
                document.removeEventListener('keydown', handleArrowPress)
            }
        }, [conn]
    )

    return (
        <>
            { gameState && <PrintMatrix matrix={ gameState.matrix } /> }
        </>
    )
}
export default Board
