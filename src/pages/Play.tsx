import React, { FC, useContext, useEffect, useState } from 'react'
import { BackendConnection, GameState } from '../models/game';
import { useHistory, useParams } from 'react-router';
import { enterGame } from '../services/game';
import ConnectionContext from '../services/backend';
import Controls from '../modules/game/Controls';
import Scoreboard from '../modules/game/Scoreboard';
import Board from '../modules/game/Board';
import { Message } from 'semantic-ui-react';

const Play: FC = () => {
	const history = useHistory()
	const { gameId } = useParams()
	const gid = gameId || ''

	const [initialGameState, setInitialGameState] = useState<GameState>()
	const conn = useContext<BackendConnection>(ConnectionContext)

	const listener = (event: string, data: string) => {
		switch (event) {
			case'game_canceled':
			case 'game_not_found':
				history.push('/')
				break
			case 'game_started':
				conn.removeMessageListener(listener)
				history.push(`/play/${gameId}`)
		}
	}

	const init = async (conn: BackendConnection) => {
		if (!gameId) {
			return
		}
		try {
			await enterGame(conn, gameId || '')
		} catch (e) {
			alert(e)
			history.push('/')
			return
		}
		setInitialGameState(await conn.send<GameState>('send_state'))
	}

	useEffect(() => {
		conn.addMessageListener(listener)
		init(conn)
		return () => {
			conn && conn.removeMessageListener(listener)
		}
	}, [conn])

	if (gid === '') {
		return ( <Message error>No game id provided</Message> )
	}

	return (
		<>
			{ initialGameState && conn && (
				<>
					<Controls initialGameState={ initialGameState } />
					<Scoreboard initialGameState={ initialGameState } />
					<Board initialGameState={ initialGameState } />
				</> ) }
		</>
	)
}

export default Play
