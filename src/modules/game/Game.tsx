import React, { FC } from 'react'
import Board from './Board'
import Scoreboard from './Scoreboard'
import Controls from './Controls'
import { GameHandle } from '../../models/game';

interface Props {
    game: GameHandle
}

const Game: FC<Props> = (props: Props) => {
    return (
        <>
            <Controls game={ props.game } />
            <Scoreboard game={ props.game } />
            <Board game={ props.game } />
        </>
    )
}
export default Game
