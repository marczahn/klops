import React, { FC, useState } from 'react';
import { Button, Header, Image, Modal } from 'semantic-ui-react'

interface Props {
    reconnect: () => void

}

const ConnectionClosed: FC<Props> = (props: Props) => {
    const [loading, setLoading] = useState<boolean>(false)
    const reconnect = () => {
        setLoading(true)
        props.reconnect()
    }
    return (
        <Modal open={ true }>
            <Modal.Header>Connection lost</Modal.Header>
            <Modal.Content>
                <p>The connection to the server has been lost</p>
                <p><Button primary onClick={reconnect} disabled={loading}>Reconnect</Button></p>
            </Modal.Content>
        </Modal>
    )
}

export default ConnectionClosed
