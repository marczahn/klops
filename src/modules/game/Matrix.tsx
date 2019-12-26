import React, {FC, useEffect, useState} from 'react'
import {MatrixTd} from './matrix.sc'
import {GameControls, GameState} from '../../services/local'

interface Props {
	gameControls: GameControls;
}

const Matrix: FC<Props> = (props: Props) => {
	const [gameState, setGameState] = useState<GameState>(props.gameControls.getGameState)
	// matrixScalar is necessary because setGameState does not realize a changed matrix as a new value
	const [_, setMatrixScalar] = useState<string>('')
	let clearHandle = -1
	useEffect(() => {
		clearHandle = window.setInterval(() => {
			const state = props.gameControls.getGameState()
			setGameState(state)
			setMatrixScalar(conc(state.matrix))
		}, 100)
		return () => {
			window.clearTimeout(clearHandle)
		}
	})
	const conc = (matrix: number[][]): string => {
		return Array.from(matrix).reduce(
				(acc, y) => {
					return `${acc}` + y.reduce(
							(acc, x) => {
								return `${acc}-${x}`
							},
							''
					)
				},
				''
		)
	}
	return (
			<table>
				<tbody>{
					gameState.matrix.map((yv, y) => <tr key={y}>{yv.map((xv, x) => <MatrixTd key={`${y}-${x}`}
																							 className={`cell-${xv}`}>{xv}</MatrixTd>)}</tr>)
				}</tbody>
			</table>
	)
}
export default Matrix