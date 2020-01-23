import React, { FC, useEffect, useState } from 'react'
import { blockCreated, linesCompleted } from '../../services/local'
import { GameHandle, GameState } from '../../models/game';

interface Props {
    game: GameHandle
}

const Scoreboard: FC<Props> = (props: Props) => {
    const [blockCount, setBlockCount] = useState<number>(0)
    const [lineCount, setLineCount] = useState<number>(0)
    const [level, setLevel] = useState<number>(0)

    useEffect(() => {
        ( async () => {
            // We keep this within a function to keep the stack of Scoreboard clean
            const state = await props.game.getState()
            setLineCount(state.lineCount || 0)
            setBlockCount(state.blockCount)
            setLevel(state.level)
        } )()
    }, [props.game])

    const update = (state: GameState, action: string) => {
        switch (action) {
            case linesCompleted:
                setLineCount(state.lineCount || 0)
                setLevel(state.level)
                break
            case blockCreated:
                setBlockCount(state.blockCount)
                break
        }
    }

    props.game.addListener(update)

    return (
        <>
            <div>Lines: { lineCount }</div>
            <div>Level: { level }</div>
            <div>Blocks: { blockCount }</div>
            <div>Next block:
            </div>
        </>
    )
}

export default Scoreboard
