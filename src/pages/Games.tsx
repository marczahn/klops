import React, {FC} from 'react'
import {Button} from 'semantic-ui-react'
import {useHistory} from 'react-router'
import {uuidv4} from '../services/utils'

const Games: FC = () => {
	const history = useHistory()

	const toLobby = () => {
		history.push('/lobby/' + uuidv4())
	}

	return (
		<Button type='submit' onClick={toLobby}>Create game</Button>
	)
}

export default Games
