import React, {FC, useEffect} from 'react'
import Board from './Board'
import {create} from '../../services/local'
import Scoreboard from './Scoreboard'
import Controls from './Controls'
import {useParams} from 'react-router'
import {loadGameProps} from '../../services/store'

const Game: FC = () => {
	const {gameId} = useParams()
	console.log(gameId)
	const gameProps = loadGameProps(gameId || '')
	const controls = create(gameProps)

	useEffect(controls.run, [])

	return (
		<>
			<Controls gameControls={controls}/>
			<Scoreboard gameControls={controls}/>
			<Board gameControls={controls}/>
		</>
	)
}
export default Game