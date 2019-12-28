import React, {FC, useEffect} from 'react'
import Matrix from './Matrix'
import {start} from '../../services/local'

const Game: FC = () => {
	const controls = start(10, 20)

	const handleArrowPress = (e: KeyboardEvent) => {
		switch (e.code) {
			case 'ArrowRight':
				controls.moveRight()
				break
			case 'ArrowLeft':
				controls.moveLeft()
				break
			case 'ArrowDown':
				controls.moveDown()
				break
			case 'ArrowUp':
				controls.rotate()
				break
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', handleArrowPress)
		return () => {
			document.removeEventListener('keydown', handleArrowPress)
			// When you switch the page
			controls.stopGame()
		}
	})

	return (<Matrix gameControls={controls}/>)
}
export default Game