import React, {FC, SyntheticEvent, useState} from 'react'
import {Button, Container, Input, Message} from 'semantic-ui-react'
import Matrix from '../modules/game/Matrix'
import {createMatrix} from '../services/local'
import {useHistory, useParams} from 'react-router'
import {gameExists, storeGameProps} from '../services/store'

const Lobby: FC = () => {
	const history = useHistory()
	const {gameId} = useParams()

	const [name, setName] = useState<string>('The greatest game')
	const [cols, setCols] = useState<number>(10)
	const [rows, setRows] = useState<number>(20)

	const onChange = (e: SyntheticEvent, data: any) => {
		console.log(data)
		switch (data.name) {
			case 'name':
				setName(data.value)
				break
			case 'cols':
				setCols(parseInt(data.value))
				break
			case 'rows':
				setRows(parseInt(data.value))
				break
		}
	}

	const startGame = () => {
		const gameProps = {
			id: gameId || '', // It is actually impossible to have no id here but the transpiler doesn't realize it
			cols: cols,
			rows: rows,
			name: name
		}
		storeGameProps(gameProps)
		history.push('/games/' + gameId)
	}
	if (gameId === undefined) {
		return (<Message error>No game id provided</Message>)
	}
	const exists = gameExists(gameId)
	if (exists) {
		return (<Message error>A game with this ID exists already</Message>)
	}

	return (
		<>
			<Input onChange={onChange} value={name} label="Name" name="name"/>
			<Input onChange={onChange} value={!isNaN(cols) ? cols : ''} label="Columns" name="cols"/>
			<Input onChange={onChange} value={!isNaN(rows) ? rows : ''} label="Rows" name="rows"/>
			<Button onClick={startGame}>Start game</Button>
			<Matrix matrix={createMatrix(cols, rows)}/>
		</>
	)
}

export default Lobby
