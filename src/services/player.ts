import { Player } from '../models/game';
import { host } from '../models/ws';

const tokenField = 'token'

export const isLoggedIn = () => {
    return !!localStorage.getItem(tokenField)
}

export const getPlayerId = (): string => {
    return localStorage.getItem(tokenField) || ''
}

export const login = async (token?: string): Promise<Player> => {
    const response = await fetch('http://' + host + '/auth', {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({ token })
    });
    
    const player: Player = await response.json();
    localStorage.setItem(tokenField, player.id)
    
    return player
}
