import React, { FC, useContext, useEffect, useState } from 'react'
import { BackendConnection, GameEvents, GameState, Participant } from '../../models/game';
import ConnectionContext from '../../services/backend';

interface Props {
  initialGameState: GameState
}

const Scoreboard: FC<Props> = (props: Props) => {
  const conn = useContext<BackendConnection>(ConnectionContext)
  const [gameState, setGameState] = useState<GameState>(props.initialGameState)
  const [blockCount, setBlockCount] = useState<number>(0)
  const [lineCount, setLineCount] = useState<number>(0)
  const [level, setLevel] = useState<number>(0)
  const [participants, setParticipants] = useState<Participant[]>([])

  const listener = (event: string, data: string) => {
    let state: GameState
    switch (event) {
      case GameEvents.linesCompleted:
        state = JSON.parse(data)
        setGameState(state)
        setLineCount(state.lineCount || 0)
        setLevel(state.level)
        break
      case GameEvents.blockCreated:
        state = JSON.parse(data)
        setGameState(state)
        setBlockCount(state.blockCount)
        break
    }
  }

  useEffect(() => {
      ( async () => {
          setParticipants(await conn.send<Participant[]>('send_participants'))
      } )()
  }, [gameState.lineCount])

  useEffect(() => {
    ( async () => {
      // We keep this within a function to keep the stack of Scoreboard clean
      setLineCount(props.initialGameState.lineCount || 0)
      setBlockCount(props.initialGameState.blockCount)
      setLevel(props.initialGameState.level)
      conn.addMessageListener(listener)
      return () => {
        conn.removeMessageListener(listener)
      }
    } )()
  }, [conn, gameState.lineCount])

    console.log(gameState.players)

  return (
    <>
      <div>Lines: { gameState.lineCount }</div>
      <div>Level: { gameState.level }</div>
      <div>Blocks: { gameState.blockCount }</div>
      <div>
        Players:
        <ul>
          { participants.map((participant) => <li>{ participant.name }: { participant.points }</li>) }
        </ul>
      </div>
      <div>Next block:
      </div>
    </>
  )
}

export default Scoreboard
