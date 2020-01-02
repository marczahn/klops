import React from 'react'
import './App.css'
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import index from './pages'
import Games from './pages/Games'
import game from './pages/game'
import Lobby from './pages/Lobby'
import {Container} from 'semantic-ui-react'

const App: React.FC = () => {
	return (
		<div className="App">
			<Container>
				<BrowserRouter>
					<Switch>
						<Route component={index} exact path="/"/>
						<Route component={Games} exact path="/games"/>
						<Route component={game} path="/games/:gameId"/>
						<Route component={Lobby} path="/lobby/:gameId"/>
						<Redirect to="/"/>
					</Switch>
				</BrowserRouter>
			</Container>
		</div>
	)
}

export default App
