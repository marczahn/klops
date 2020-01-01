import React from 'react'
import './App.css'
import {Redirect, Route, Router, Switch} from 'react-router-dom'
import index from './pages'
import createBrowserHistory from 'history/createBrowserHistory'
import games from './pages/games'
import game from './pages/game'

const App: React.FC = () => {
	return (
		<div className="App">
			<header className="App-header">

			</header>
			<Router history={createBrowserHistory()}>
				<Switch>
					<Route component={index} exact path="/" />
					<Route component={games} exact path="/games" />
					<Route component={game} path="/games/:game" />
					<Redirect to="/" />
				</Switch>
			</Router>
		</div>
	)
}

export default App
