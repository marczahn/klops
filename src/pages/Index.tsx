import React, { FC, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import { createGame, onGamesList } from '../services/game';
import { BackendConnection, GameState } from '../models/game';
import ConnectionContext from '../services/backend';
import { Link } from 'react-router-dom';

interface Props {
    conn: BackendConnection
}

const Index: FC<Props> = (props: Props) => {
    const history = useHistory()
    const [games, setGames] = useState<GameState[]>([])
    const conn = useContext<BackendConnection>(ConnectionContext)
    
    const listListener = onGamesList(setGames)
    
    useEffect(() => {
        ( async () => {
            conn.addMessageListener(listListener)
            setGames(await conn.send<GameState[]>('send_games'))
        } )()
        return () => {
            conn.removeMessageListener(listListener)
        }
    }, [conn])
    
    const onCreateGame = async () => {
        try {
            const game = await createGame(conn)
            history.push('/lobby/' + game.id)
        } catch
            (e) {
            console.log(e)
        }
    }
    
    return (
        <>
            <Button type='submit' onClick={ onCreateGame }>Create new game</Button>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Game name</Table.HeaderCell>
                        <Table.HeaderCell>Size</Table.HeaderCell>
                        <Table.HeaderCell>Players</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    { games.map((game, i) => (
                        <Table.Row key={ i }>
                            <Table.Cell>{ game.name }</Table.Cell>
                            <Table.Cell>{ game.cols } x { game.rows }</Table.Cell>
                            <Table.Cell>{ game.players.length }</Table.Cell>
                            <Table.Cell><Link to={ `/lobby/${ game.id }` }>Go to game</Link></Table.Cell>
                        </Table.Row>
                    )) }
                </Table.Body>
            </Table>
        </>
    )
}

export default Index
