import { BackendConnection, GameEvents, Participant } from '../../models/game';
import React, { FC, useContext, useEffect, useState } from 'react';
import ConnectionContext from '../../services/backend';

const LobbyParticipants: FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([])
  const conn = useContext<BackendConnection>(ConnectionContext)

  const listener = (event: string, data: string) => {
    switch (event) {
      case GameEvents.playerAdded:
        conn.send<Participant[]>('send_participants').then(rsl => setParticipants(rsl))
        break
      case GameEvents.playerRemoved:
        conn.send<Participant[]>('send_participants').then(rsl => setParticipants(rsl))
        break
    }
  }
  useEffect(() => {
    conn.addMessageListener(listener)
    conn.send<Participant[]>('send_participants').then(rsl => setParticipants(rsl))
    return () => {
      conn.removeMessageListener(listener)
    }
  }, [conn])

  return ( <ul>
      { participants.map((p: Participant) => ( <li key={ p.id }>{ p.name }</li> )) }
    </ul>
  )
}

export default LobbyParticipants
