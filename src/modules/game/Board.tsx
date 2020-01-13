import React, { FC, useEffect, useState } from 'react'
import { looped } from '../../services/local'
import PrintMatrix from './PrintMatrix'
import { GameHandle, GameState } from '../../models/game';

interface Props {
    game: GameHandle;
}

const Board: FC<Props> = (props: Props) => {
    const [gameState, setGameState] = useState<GameState>()
    // counter is used to trigger a rendering of the matrix
    const [_, setCounter] = useState<number>(0)

    const handleArrowPress = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'ArrowRight':
                props.game.moveRight()
                break
            case 'ArrowLeft':
                props.game.moveLeft()
                break
            case 'ArrowDown':
                props.game.moveDown()
                break
            case 'ArrowUp':
                props.game.rotate()
                break
        }
    }

    useEffect(() => {
        ( async () => {
            // We keep this within a function to keep the stack of Scoreboard clean
            const state = await props.game.getState()
            setGameState(state)
            setCounter(state.stepCount)
        } )()
        props.game.addListener((state: GameState, action: string) => {
            if (action !== looped) {
                return
            }
            setGameState(state)
            setCounter(state.stepCount)
        })
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', handleArrowPress)
        return () => {
            document.removeEventListener('keydown', handleArrowPress)
            // When you switch the page
        }
    }, [])

    return (
        <>
            { gameState && <PrintMatrix matrix={ gameState.matrix } /> }
        </>
    )
}
export default Board
