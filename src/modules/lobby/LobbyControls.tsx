import { BackendConnection, GameState } from '../../models/game';
import React, { FC, SyntheticEvent, useContext, useEffect, useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import ConnectionContext from '../../services/backend';

interface Props {
    initialState: GameState
    playerId: string
}

const LobbyControls: FC<Props> = (props: Props) => {
    const isOwner = props.playerId === props.initialState.owner
    const history = useHistory()
    const [gameState, setGameState] = useState<GameState>(props.initialState)
    const conn = useContext<BackendConnection>(ConnectionContext)
    
    const onChange = (_: SyntheticEvent, data: any) => {
        let newName = gameState.name
        let newCols = gameState.cols
        let newRows = gameState.rows
        switch (data.name) {
            case 'name':
                newName = data.value
                break
            case 'cols':
                newCols = parseInt(data.value)
                break
            case 'rows':
                newRows = parseInt(data.value)
                break
        }
        conn.send('change_config', { cols: newCols, rows: newRows, name: newName })
    }
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

    const onCancel = (e: SyntheticEvent) => {
        conn.send('cancel_game')
    }

    const onLeave = async () => {
        await conn.send('leave_game')
        history.push('/')
    }

    const onStart = () => {
        history.push('/games/' + props.initialState.id)
    }
    return (
        <>
            <Input disabled={ !isOwner } onChange={ onChange } value={ gameState.name } label="Name" name="name" />
            <Input disabled={ !isOwner } onChange={ onChange } value={ gameState.cols } label="Columns" name="cols" />
            <Input disabled={ !isOwner } onChange={ onChange } value={ gameState.rows } label="Rows" name="rows" />
            { isOwner ? (
                <>
                    <Button onClick={ onStart }>Start game</Button>
                    <Button onClick={ onCancel }>Cancel</Button>
                </>
            ) : (
                <Button onClick={ onLeave }>Leave game</Button>
            ) }
        </>
    )
}

export default LobbyControls
