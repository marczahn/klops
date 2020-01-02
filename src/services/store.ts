import {GameProps} from './interfaces'

export const gameExists = (gameID: string): boolean => localStorage.getItem('game_' + gameID) !== null

export const storeGameProps = (props: GameProps) => localStorage.setItem('gameprops_' + props.id, JSON.stringify(props))

export const loadGameProps = (gameId: string): GameProps => {
	const content = localStorage.getItem('gameprops_' + gameId)
	return JSON.parse(content || '{}')
}