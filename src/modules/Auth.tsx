import React, { ChangeEvent, FC, FormEvent, PropsWithChildren, useState } from 'react';
import { Button, Form, Input, InputOnChangeData, Modal } from 'semantic-ui-react'
import { BackendConnection } from '../models/game';

interface Props {
    loggedIn: boolean
    conn: BackendConnection
}

const Auth: FC<PropsWithChildren<Props>> = (props: PropsWithChildren<Props>) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [username, setUsername] = useState<string>('')
    const [errors, setErrors] = useState<string[]>([])

    const onChangeUsername = (_: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        setUsername(data.value)
    }

    const onSubmit = async (event: FormEvent) => {
        setLoading(true)
        event.preventDefault()
        try {
            const player = await props.conn.send('signup', username)
        } catch (e) {
            const err: string[] = e
            setErrors(err)
        }
        setLoading(false)
    }

    return (
        <>
            {
                props.loggedIn ? props.children :
                    ( <Modal open={ true }>
                        <Modal.Header>Choose a username</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={ onSubmit }>
                                <Form.Field
                                    control={Input}
                                    label='Username'
                                    placeholder='Username'
                                    error={errors.length ? {
                                        content: 'Please enter a username',
                                        pointing: 'below',
                                    }: null}
                                    onChange={onChangeUsername}
                                    disabled={loading}
                                />
                                <Form.Field disabled={loading}>
                                    <Button>Login</Button>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                    </Modal> )
            }
        </>
    )
}

export default Auth
