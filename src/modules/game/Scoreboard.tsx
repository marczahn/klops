import {GameControls} from '../../services/interfaces'
import React, {FC, useEffect, useState} from 'react'

interface Props {
	gameControls: GameControls
}

const Scoreboard: FC<Props> = (props: Props) => {
	let clearHandle = -1
	const [lineCount, setLineCount] = useState<number>(0)
	const [blockCount, setBlockCount] = useState<number>(0)

	useEffect(() => {
		clearHandle = window.setInterval(update, 100)
		return () => {
			window.clearTimeout(clearHandle)
		}
	}, [])

	const update = () => {
		const state = props.gameControls.getGameState()
		setLineCount(state.lineCount)
		setBlockCount(state.blockCount)
	}

	return (
		<>
			<div>Lines: {lineCount}</div>
			<div>Blocks: {blockCount}</div>
		</>
	)
}

export default Scoreboard