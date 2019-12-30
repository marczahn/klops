import React, {FC} from 'react'
import Board from './Board'
import {start} from '../../services/local'
import Scoreboard from './Scoreboard'

const Game: FC = () => {
	const controls = start(10, 20)

	return (
		<div className="board">
			<Scoreboard gameControls={controls}/>
			<Board gameControls={controls}/>
		</div>
	)
}
export default Game