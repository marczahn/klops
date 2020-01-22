import React, { FC, useContext, useEffect, useState } from 'react'
import { Message } from 'semantic-ui-react'
import { useHistory, useParams } from 'react-router'
import { BackendConnection, GameState } from '../models/game';
import ConnectionContext from '../services/backend';
import { getPlayerId } from '../services/player';
import LobbyControls from '../modules/lobby/LobbyControls';
import LobbyParticipants from '../modules/lobby/LobbyParticipants';
import LobbyMatrix from '../modules/lobby/LobbyMatrix';
import { enterGame } from '../services/game';

const Lobby: FC = () => {
    const history = useHistory()
    const { gameId } = useParams()
    const gid = gameId || ''
    const playerId = getPlayerId()

    const [initialGameState, setInitialGameState] = useState<GameState>()
    const conn = useContext<BackendConnection>(ConnectionContext)

    const listener = (event: string, data: string) => {
        switch (event) {
            case'game_canceled':
            case 'game_not_found':
                history.push('/')
                break
        }
    }
    
    const init = async (conn: BackendConnection) => {
        if (!gameId) {
            // TODO - return to list
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
    }, [])


    if (gid === '') {
        return ( <Message error>No game id provided</Message> )
    }

    return (
        <>
            { initialGameState && conn && (
                <>
                    <LobbyControls initialState={ initialGameState } playerId={ playerId } />
                    <LobbyParticipants />
                    <LobbyMatrix initialState={ initialGameState } />
                </> ) }
        </>
    )
}

export default Lobby
