import React, { FC, useEffect, useState } from 'react'
import { Button, Table } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import { createGame, onGamesList } from '../services/game';
import { BackendConnection, GameState } from '../models/game';
import { connectToList } from '../services/backend';
import { Link } from 'react-router-dom';
import ConnectionClosed from '../modules/ConnectionClosed';

const Index: FC = () => {
    const history = useHistory()
    const [games, setGames] = useState<GameState[]>([])
    const [backendConnection, setBackendConnection] = useState<BackendConnection>()
    const [connectionLost, setConnectionLost] = useState<boolean>(false)

    const reconnect = async () => {
        await connect()
    }

    const connect = async () => {
        try {
            setConnectionLost(false)
            const conn = await connectToList()
            conn.addMessageListener(toLobbyHandler)
            conn.addMessageListener(onGamesList(setGames))
            conn.addCloseListener(closedHandler)
            setBackendConnection(conn)
            conn.send('send_games', null)
        } catch (e) {
            setConnectionLost(true)
        }
    }

    useEffect(() => {
        ( async () => {
            await connect()
        } )()
        return () => {
            if (backendConnection) {
                backendConnection.close()
            }
        }
    }, [])

    const closedHandler = () => {
        setConnectionLost(true)
    }

    const toLobbyHandler = (event: string, data: string) => {
        if (event !== 'own_game_added') {
            return
        }
        const game: GameState = JSON.parse(data)
        history.push('/lobby/' + game.id)
    }

    const onCreateGame = async () => {
        try {
            if (backendConnection) {
                createGame(backendConnection)
            } else {
                alert('Could not create game')
            }
        } catch (e) {
            alert(e)
        }
    }

    return (
        <>
            {connectionLost && (<ConnectionClosed reconnect={reconnect} />)}
            <Button type='submit' onClick={ onCreateGame }>Create new game</Button>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Game name</Table.HeaderCell>
                        <Table.HeaderCell>Size</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    { games.map((game, i) => (
                        <Table.Row key={ i }>
                            <Table.Cell>{ game.name }</Table.Cell>
                            <Table.Cell>{ game.cols } x { game.rows }</Table.Cell>
                            <Table.Cell><Link to={ `/lobby/${ game.id }` }>Go to game</Link></Table.Cell>
                        </Table.Row>
                    )) }
                </Table.Body>
            </Table>
        </>
    )
}

export default Index
