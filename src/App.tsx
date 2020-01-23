import React, { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Index from './pages/Index'
import Play from './pages/Play'
import Lobby from './pages/Lobby'
import { Button, Container, Grid, Loader, Modal } from 'semantic-ui-react'
import { getPlayerId, isLoggedIn, login } from './services/player';
import { BackendConnection } from './models/game';
import ConnectionContext, { connectToList } from './services/backend';
import ConnectionClosed from './modules/ConnectionClosed';

const App: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any>()
    const [conn, setConn] = useState<BackendConnection>()
    const reconnect = async () => {
        await connect()
    }
    
    const connect = async () => {
        try {
            const conn = await connectToList(getPlayerId())
            conn.addCloseListener((event: WebSocketCloseEvent) => {
                console.log('WS closed with ' + event.code)
            })
            setConn(conn)
        } catch (e) {
            if (conn) {
                conn.close()
            }
        }
    }
    
    const doLogin = async () => {
        const lin = isLoggedIn()
        setLoggedIn(lin)
        
        try {
            await login(getPlayerId())
            setLoggedIn(true)
            await connect()
        } catch (e) {
            setError(e.toString())
        } finally {
            setLoading(false)
        }
    }
    
    const reloadPage = () => {
        window.location.reload();
    }
    
    useEffect(() => {
        ( async () => {
            await doLogin()
        } )()
    }, [])
    
    if (error) {
        return ( <Modal open={ true }>
            <Modal.Header>Error occured</Modal.Header>
            <Modal.Content>
                <p>An error occured while loading KLOPS: { error }</p>
                <p><Button primary onClick={ reloadPage }>Reload</Button></p>
            </Modal.Content>
        </Modal> )
    }
    
    return (
        <>
            { conn ? (
                <ConnectionContext.Provider value={ conn }>
                    {
                        !loggedIn || loading ? (
                            <Grid textAlign='center' style={ { height: '100vh' } } verticalAlign='middle'>
                                <Loader active>Loading</Loader>
                            </Grid>
                        ) : (
                            <div className="App">
                                <Container>
                                    <BrowserRouter>
                                        <Switch>
                                            <Route component={ Index } exact path="/" />
                                            <Route component={ Play } path="/games/:gameId" />
                                            <Route component={ Lobby } path="/lobby/:gameId" />
                                            <Redirect to="/" />
                                        </Switch>
                                    </BrowserRouter>
                                </Container>
                            </div>
                        )
                    } </ConnectionContext.Provider> ) : <ConnectionClosed reconnect={ reconnect } />
            }
        </>
    )
}
export default App
