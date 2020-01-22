import React, { FC, useContext, useEffect, useState } from 'react'
import Game from '../modules/game/Game'
import { BackendConnection, GameHandle } from '../models/game';
import { useParams } from 'react-router';
import { getGameHandle } from '../services/game';
import ConnectionContext from '../services/backend';

const Play: FC = () => {

	const {gameId} = useParams()
	const [gameHandle, setGameHandle] = useState<GameHandle>()
	const conn = useContext<BackendConnection>(ConnectionContext)

	useEffect(() => {
		const gh = getGameHandle(conn)
		setGameHandle(gh)
		return gh.disconnect
	}, [])
	return (<>{gameHandle  && (<Game game={gameHandle} />)}</>)
}

export default Play
