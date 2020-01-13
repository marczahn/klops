import React, { FC, useEffect, useState } from 'react'
import Game from '../modules/game/Game'
import { GameHandle } from '../models/game';
import { connectToGame } from '../services/backend';
import { useParams } from 'react-router';
import { getGameHandle } from '../services/game';

const Play: FC = () => {

	const {gameId} = useParams()
	const  gid = gameId || ''
	const [gameHandle, setGameHandle] = useState<GameHandle>()

	useEffect(() => {
		( async () => {
			const gh = getGameHandle(await connectToGame(gid))
			setGameHandle(gh)
		} )()
		return () => {
			if (gameHandle) {
				gameHandle.disconnect()
			}
		}
	}, [])
	return (<>{gameHandle  && (<Game game={gameHandle} />)}</>)
}

export default Play
