import {ExternalGameState, GameControls} from '../../services/interfaces'
import React, {FC, useEffect, useState} from 'react'
import {blockCreated, linesCompleted} from '../../services/local'
import Matrix from './Matrix'

interface Props {
	gameControls: GameControls
}

const Scoreboard: FC<Props> = (props: Props) => {
	const [blockCount, setBlockCount] = useState<number>(0)
	const [lineCount, setLineCount] = useState<number>(0)
	const [points, setPoints] = useState<number>(0)
	const [level, setLevel] = useState<number>(0)
	const [nextBlock, setNextBlock] = useState<number[][]>([])

	useEffect(() => {
		// We keep this within a function to keep the stack of Scoreboard clean
		const state = props.gameControls.getGameState()
		setLineCount(state.lineCount)
		setBlockCount(state.blockCount)
		setLevel(state.level)
		setNextBlock(state.nextBlock)
		setPoints(state.points)
	}, [])

	const update = (state: ExternalGameState, action: string) => {
		switch (action) {
			case linesCompleted:
				setLineCount(state.lineCount)
				setPoints(state.points)
				setLevel(state.level)
				break
			case blockCreated:
				setBlockCount(state.blockCount)
				setNextBlock(state.nextBlock)
				break
		}
	}

	props.gameControls.addListener(update)

	return (
		<>
			<div>Lines: {lineCount}</div>
			<div>Points: {points}</div>
			<div>Level: {level}</div>
			<div>Blocks: {blockCount}</div>
			<div>Next block:
			<Matrix matrix={nextBlock}/>
			</div>
		</>
	)
}

export default Scoreboard