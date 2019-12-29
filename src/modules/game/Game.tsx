import React, {FC, useEffect} from 'react'
import Matrix from './Matrix'
import {start} from '../../services/local'

const Game: FC = () => {
	const controls = start(10, 20)

	return (<Matrix gameControls={controls}/>)
}
export default Game