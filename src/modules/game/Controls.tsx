import {ExternalGameState, GameHandle} from '../../services/interfaces'
import React, {FC, useEffect, useState} from 'react'
import {blockCreated, linesCompleted} from '../../services/local'
import Matrix from './Matrix'
import {Input} from 'semantic-ui-react'

interface Props {
	gameControls: GameHandle
}

const Controls: FC<Props> = (props: Props) => {

	useEffect(() => {
	}, [])


	return (
		<>

		</>
	)
}

export default Controls