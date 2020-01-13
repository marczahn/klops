import { BackendConnection, CloseListener, GameHandle, MessageListener } from '../models/game';
import WebSocket from 'ws';

interface DisassembledMessage {
    event: string
    data: string
}

export const connectToList = (): Promise<BackendConnection> => connectToBackend()

export const connectToGame = (gameId: string): Promise<BackendConnection> => connectToBackend(gameId)

const connectToBackend = (gameId?: string): Promise<BackendConnection> => {
    let url = 'ws://localhost:8080/ws'
    if (gameId) {
        url += `?game=${gameId}`
    }
    let ws = new window.WebSocket(url)
    let messageListeners: ( (event: string, data: string) => void )[] = []
    let closeListeners: ( (event: WebSocketCloseEvent) => void )[] = []
    ws.onmessage = (e: WebSocketMessageEvent) => {
        const {event, data} = disassembleMessage(e.data)
        console.log(messageListeners)
        messageListeners.forEach(l => l(event, data))
        console.log('WS response', e)
    }
    ws.onclose = (event: WebSocketCloseEvent) => {
        console.log('WS connection closed')
        closeListeners.forEach(l => l(event))

        // if (event.code !== 1005) {
        //     // TODO - Checklater for websocket disconnects
        // }
    }
    return new Promise<BackendConnection>((res, rej) => {
        ws.onopen = () => {
            console.log('Open ws connection')
            res({
                removeMessageListener: (l: MessageListener) => {
                    messageListeners = messageListeners.filter(listener => l !== listener)
                },
                removeCloseListener: (l: CloseListener) => {
                    closeListeners = closeListeners.filter(listener => l !== listener)
                },
                addCloseListener: (l: CloseListener) => {
                    closeListeners.push(l)
                },
                addMessageListener: (l: MessageListener) => {
                    messageListeners.push(l)
                },
                send: (event, data) => {
                    ws.send(assembleMessage(event, data))
                },
                close: ws.close
            })
        }
        ws.onerror = (e: Event) => {
            console.log('WS could not be opened with', e)
            rej(e)
        }
    })
}

const assembleMessage = (event: string, data: any) => {
    const serialized = JSON.stringify(data)
    return event + '@' + serialized
}

const disassembleMessage = (data: WebSocket.Data): DisassembledMessage => {
    const resolved = data.toString().split(/\@(.+)/)

    return { event: resolved[ 0 ], data: resolved[ 1 ] }
}
