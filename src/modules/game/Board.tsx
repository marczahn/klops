import React, {FC} from 'react'
import Matrix from './Matrix'
import {start} from '../../services/local'
import Scoreboard from './Scoreboard'

const Board: FC = () => {
	const controls = start(10, 20)

	return (
		<div className="board">
			<Scoreboard gameControls={controls}/>
			<Matrix gameControls={controls}/>
		</div>
	)
}
export default Board