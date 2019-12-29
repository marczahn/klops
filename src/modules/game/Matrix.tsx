import React, {FC, useEffect, useState} from 'react'
import {MatrixTd} from './matrix.sc'
import {GameControls, ExternalGameState} from '../../services/interfaces'

interface Props {
	gameControls: GameControls;
}

const Matrix: FC<Props> = (props: Props) => {
	const [gameState, setGameState] = useState<ExternalGameState>(props.gameControls.getGameState)
	// matrixScalar is necessary because setGameState does not realize a changed matrix as a new value
	const [_, setCounter] = useState<number>(0)
	let lastMove = Date.now()
	let clearHandle = -1

	useEffect(() => {
		clearHandle = window.setInterval(update, 100)
		return () => {
			window.clearTimeout(clearHandle)
		}
	}, [])

	const handleArrowPress = (e: KeyboardEvent) => {
		if (Date.now() - lastMove < 50) {
			return
		}
		lastMove = Date.now()
		switch (e.code) {
			case 'ArrowRight':
				props.gameControls.moveRight()
				update()
				break
			case 'ArrowLeft':
				props.gameControls.moveLeft()
				update()
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

	const update = () => {
		const state = props.gameControls.getGameState()
		setGameState(state)
		setCounter(state.counter)
	}

	const serializeMatrix = (matrix: number[][]): string => {
		return Array.from(matrix).reduce(
			(acc, y) => `${acc}` + y.reduce((acc, x) => `${acc}-${x}`, ''), ''
		)
	}
	return (
		<table>
			<tbody>{
				gameState.matrix.map(
					(yv: number[], y: number) => <tr key={y}>{yv.map((xv, x) => <MatrixTd key={`${y}-${x}`}
																		className={`cell-${xv}`}>{xv}</MatrixTd>)}</tr>)
			}</tbody>
		</table>
	)
}
export default Matrix