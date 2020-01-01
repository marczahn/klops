import React, {FC, useEffect} from 'react'
import Board from './Board'
import {start} from '../../services/local'
import Scoreboard from './Scoreboard'
import {Container} from 'semantic-ui-react'

const Game: FC = () => {
	const controls = start(10, 20)

	useEffect(controls.run, [])

	return (
		<Container>
			<Scoreboard gameControls={controls}/>
			<Board gameControls={controls}/>
		</Container>
	)
}
export default Game