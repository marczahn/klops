import { BackendConnection, GameState } from '../../models/game';
import React, { FC, SyntheticEvent, useContext, useEffect, useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import PrintMatrix from '../game/PrintMatrix';
import { createMatrix } from '../../services/local';
import ConnectionContext from '../../services/backend';

interface Props {
    initialState: GameState
}

const LobbyMatrix: FC<Props> = (props: Props) => {
    const [gameState, setGameState] = useState<GameState>(props.initialState)
    const conn = useContext<BackendConnection>(ConnectionContext)
    
    const listener = (event: string, data: string) => {
        switch (event) {
            case 'config_updated':
                setGameState(JSON.parse(data))
                break
        }
    }
    useEffect(() => {
        conn.addMessageListener(listener)
        return () => {
            conn.removeMessageListener(listener)
        }
    }, [conn])

    return (
        <PrintMatrix matrix={ createMatrix(gameState.cols, gameState.rows) } />
    )
}

export default LobbyMatrix
