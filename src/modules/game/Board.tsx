import React, {FC, useEffect, useState} from 'react'
import {ExternalGameState, GameHandle} from '../../services/interfaces'
import {LOOPED} from '../../services/local'
import Matrix from './Matrix'

interface Props {
	gameControls: GameHandle;
}

const Board: FC<Props> = (props: Props) => {
	const [gameState, setGameState] = useState<ExternalGameState>(props.gameControls.getState)
	// counter is used to trigger a rerendering of the matrix
	const [_, setCounter] = useState<number>(0)

	useEffect(() => {
		props.gameControls.addListener((state: ExternalGameState, action: string) => {
			if (action !== LOOPED) {
				return
			}
			setGameState(state)
			setCounter(state.counter)
		})
	}, [])

	const handleArrowPress = (e: KeyboardEvent) => {
		switch (e.code) {
			case 'ArrowRight':
				props.gameControls.moveRight()
				break
			case 'ArrowLeft':
				props.gameControls.moveLeft()
				break
			case 'ArrowDown':
				props.gameControls.moveDown()
				break
			case 'ArrowUp':
				props.gameControls.rotate()
				break
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', handleArrowPress)
		return () => {
			document.removeEventListener('keydown', handleArrowPress)
			// When you switch the page
		}
	}, [])

	return (<Matrix matrix={gameState.matrix} />)
}
export default Board