import React from 'react'
import './App.css'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Index from './pages/Index'
import Play from './pages/Play'
import Lobby from './pages/Lobby'
import { Container } from 'semantic-ui-react'

const App: React.FC = () => {
	return (
		<div className="App">
			<Container>
				<BrowserRouter>
					<Switch>
						<Route component={Index} exact path="/"/>
						<Route component={Play} path="/games/:gameId"/>
						<Route component={Lobby} path="/lobby/:gameId"/>
						<Redirect to="/"/>
					</Switch>
				</BrowserRouter>
			</Container>
		</div>
	)
}

export default App
