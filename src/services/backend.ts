import { BackendConnection, CloseListener, MessageListener } from '../models/game';
import WebSocket from 'ws';
import { uuidv4 } from './utils';
import { CommandResponse, host, ok } from '../models/ws';
import React from 'react';

interface DisassembledMessage {
    event: string
    data: string
}

const ConnectionContext = React.createContext<BackendConnection>({
    addCloseListener: (p1: CloseListener) => {},
    addMessageListener: (p1: MessageListener) => {},
    close: () => {}, removeCloseListener: (p1: CloseListener) => {},
    removeMessageListener: (p1: MessageListener) => {},
    send: <T>(command: string, data?: any, timeout?: number) => {
        return new Promise<T>(() => {});
    },
    sendIgnore: (command: string, data?: any) => {}
})

export default ConnectionContext

export const connectToList = (playerId: string): Promise<BackendConnection> => connectToBackend(playerId)

const connectToBackend = (playerId: string): Promise<BackendConnection> => {
    const params: string[] = [`player=${ playerId }`]
    let url = 'ws://' + host + '/ws?' + params.join('&')
    
    let ws = new window.WebSocket(url)
    let messageListeners: ( (event: string, data: string) => void )[] = []
    let closeListeners: ( (event: WebSocketCloseEvent) => void )[] = []
    
    const removeCloseListener = (l: CloseListener) => {
        closeListeners = closeListeners.filter(listener => l !== listener)
    }
    const removeMessageListener = (l: MessageListener) => {
        messageListeners = messageListeners.filter(listener => l !== listener)
    }
    const addCloseListener = (l: CloseListener) => {
        closeListeners.push(l)
    }
    const addMessageListener = (l: MessageListener) => {
        messageListeners.push(l)
    }
    
    ws.onmessage = (e: WebSocketMessageEvent) => {
        const { event, data } = disassembleMessage(e.data)
        console.log('ws message', e)
        messageListeners.forEach(l => l(event, data))
    }
    ws.onclose = (event: WebSocketCloseEvent) => {
        console.log(`connection closed with ${ event.code }`)
        closeListeners.forEach(l => l(event))
    }
    return new Promise<BackendConnection>((resolve, reject) => {
        ws.onopen = () => {
            console.log('Open ws connection')
            return resolve({
                removeMessageListener: removeMessageListener,
                removeCloseListener: removeCloseListener,
                addCloseListener: addCloseListener,
                addMessageListener: addMessageListener,
                close: () => {
                    ws.close()
                },
                send: <T>(command: string, data?: any, timeout?: number): Promise<T> => {
                    const commandId = uuidv4()
                    return new Promise<T>((resolve, reject) => {
                        const commandListener: MessageListener = (event: string, data: string) => {
                            if (event !== `response_${ commandId }`) {
                                return
                            }
                            const rsp: CommandResponse<T> = JSON.parse(data)
                            removeMessageListener(commandListener)
                            if (rsp.status === ok) {
                                resolve(rsp.data)
                            }
                            reject(rsp.errors)
                        }
                        messageListeners.push(commandListener)
                        const msg = assembleMessage(command, commandId, data)
                        console.log('Send message:', msg)
                        ws.send(msg)
                        window.setTimeout(() => {
                            removeMessageListener(commandListener)
                            reject(`no response received for command ${command} and command id ${commandId}`)
                        }, timeout ? timeout : 5000)
                    })
                },
                // This is a fire and forgot method which is going to be used for movements
                sendIgnore: (command: string, data?: any) => {
                    const commandId = uuidv4()
                    const msg = assembleMessage(command, commandId, data)
                    console.log('Send message:', msg)
                    ws.send(msg)
                }
            })
        }
        ws.onerror = reject
    })
}

const assembleMessage = (command: string, id: string, data: any) => {
    const serialized = JSON.stringify(data)
    // return command + ':' + id + '@' + serialized
    return `${ command }:${ id }@${ serialized }`
}

const disassembleMessage = (data: WebSocket.Data): DisassembledMessage => {
    const resolved = data.toString().split(/\@(.+)/)
    
    return { event: resolved[ 0 ], data: resolved[ 1 ] }
}
