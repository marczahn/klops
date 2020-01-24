import React, { FC, useContext, useEffect, useState } from 'react'
import { blockCreated, linesCompleted } from '../../services/local'
import { BackendConnection, GameHandle, GameState } from '../../models/game';
import ConnectionContext from '../../services/backend';

interface Props {
    initialGameState: GameState
}

const Scoreboard: FC<Props> = (props: Props) => {
    const conn = useContext<BackendConnection>(ConnectionContext)
    const [blockCount, setBlockCount] = useState<number>(0)
    const [lineCount, setLineCount] = useState<number>(0)
    const [level, setLevel] = useState<number>(0)

    const listener = (event: string, data: string) => {
        let state: GameState
        switch (event) {
            case linesCompleted:
                state = JSON.parse(data)
                setLineCount(state.lineCount || 0)
                setLevel(state.level)
                break
            case blockCreated:
                state = JSON.parse(data)
                setBlockCount(state.blockCount)
                break
        }
    }

    useEffect(() => {
        ( async () => {
            // We keep this within a function to keep the stack of Scoreboard clean
            setLineCount(props.initialGameState.lineCount || 0)
            setBlockCount(props.initialGameState.blockCount)
            setLevel(props.initialGameState.level)
            conn.addMessageListener(listener)
            return () => {
                conn.removeMessageListener(listener)
            }
        } )()
    }, [conn])

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
