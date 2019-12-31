import React, {FC, SyntheticEvent} from 'react'
import {Button, Container, DropdownProps, Form, Select} from 'semantic-ui-react'

const games: FC = () => {
	const cols = [
		{key: '5', value: '5', text: '5'},
		{key: '10', value: '10', text: '10'},
		{key: '20', value: '20', text: '20'},
	]
	const rows = [
		{key: '10', value: '10', text: '10'},
		{key: '20', value: '20', text: '20'},
		{key: '30', value: '30', text: '30'},
	]

	const onChange = (e: SyntheticEvent, data: DropdownProps) => {
		console.log(data)
	}

	return (
		<Container>
			<Form>
				<Select onChange={onChange} placeholder="Columns" options={cols}/>
				<Button type='submit'>Submit</Button>
			</Form>

		</Container>
	)
}

export default games
