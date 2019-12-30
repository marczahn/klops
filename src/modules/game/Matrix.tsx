import React, {FC, useEffect, useState} from 'react'
import {MatrixTable} from './matrix.sc'
import {ExternalGameState, GameControls} from '../../services/interfaces'
import {LOOPED} from '../../services/local'

interface Props {
	gameControls: GameControls;
}

const Matrix: FC<Props> = (props: Props) => {
	const [gameState, setGameState] = useState<ExternalGameState>(props.gameControls.getGameState)
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

	let html = ''
	for (let y = 0; y < gameState.matrix.length; y++) {
		html += '<tr>'
		for (let x = 0; x < gameState.matrix[y].length; x++) {
			html += `<td class=cell-${gameState.matrix[y][x]}>${gameState.matrix[y][x]}</td>`
		}
		html += '</tr>'
	}
	return (
		<MatrixTable dangerouslySetInnerHTML={{ __html: html }}>

		</MatrixTable>
	)
}
export default Matrix