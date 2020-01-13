import React, { FC, SyntheticEvent, useEffect, useState } from 'react'
import { Button, Input, Message } from 'semantic-ui-react'
import PrintMatrix from '../modules/game/PrintMatrix'
import { createMatrix } from '../services/local'
import { useHistory, useParams } from 'react-router'
import { GameHandle, GameState } from '../models/game';
import { getGameHandle } from '../services/game';
import { connectToGame } from '../services/backend';

const Lobby: FC = () => {
    const history = useHistory()
    const { gameId } = useParams()
    const gid = gameId || ''

    const [gameHandle, setGameHandle] = useState<GameHandle>()

    const [name, setName] = useState<string>('The greatest game')
    const [cols, setCols] = useState<number>(10)
    const [rows, setRows] = useState<number>(20)

    const configChanged = (state: GameState, event: string) => {
        switch (event) {
            case 'config_changed':
                setCols(state.cols)
                setRows(state.rows)
                setName(state.name)
                break
            case'quit':
            case 'game_not_found':
                history.push('/')

        }
    }

    useEffect(() => {
        ( async () => {
            const gh = getGameHandle(await connectToGame(gid))
            gh.addListener(configChanged)
            gh.config(cols, rows, name)
            setGameHandle(gh)
        } )()
        return () => {
            if (gameHandle) {
                gameHandle.disconnect()
            }
        }
    }, [])

    const onChange = (_: SyntheticEvent, data: any) => {
        let newName = name
        let newCols = cols
        let newRows = rows
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
        if (gameHandle) {
            gameHandle.config(newCols, newRows, newName)
        }
    }

    const onCancel = (e: SyntheticEvent) => {
        if (gameHandle) {
            gameHandle.quit()
        }
    }

    const onStart = () => {
        history.push('/games/' + gid)
    }
    if (gid === '') {
        return ( <Message error>No game id provided</Message> )
    }

    return (
        <>
            <Input onChange={ onChange } value={ name } label="Name" name="name" />
            <Input onChange={ onChange } value={ !isNaN(cols) ? cols : '' } label="Columns" name="cols" />
            <Input onChange={ onChange } value={ !isNaN(rows) ? rows : '' } label="Rows" name="rows" />
            <Button onClick={ onStart }>Start game</Button>
            <Button onClick={ onCancel }>Cancel</Button>
            <PrintMatrix matrix={ createMatrix(cols, rows) } />
        </>
    )
}

export default Lobby
