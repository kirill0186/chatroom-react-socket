import React, { Component } from 'react';
import socketCreator from '../sockerCreator'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const socket = socketCreator.create();

export default class InputMessageComponent extends Component {
    state ={
        message: '',
    };


    handleChangeInput(e, name) {
        this.setState({
            [name]: e.target.value
        });
    };

    handleKeyDown(e){
        if(e.keyCode === 13){
            this.sendMessage();
        }
    }
    sendMessage() {
        if(this.state.message !== '') {
            let userMessage = {msg: this.state.message, time: Date.now()};
            socket.emit('message', userMessage);
            this.setState({
                message: ''
            });
        }
    }

    render() {
        const {message} = this.state;
        return (
            <div id='input-message-block'>
                <TextField
                    label="Введите сообщение"
                    id="user-name-input"
                    value={message}
                    onChange={e => this.handleChangeInput(e, "message")}
                    onKeyDown={e => this.handleKeyDown(e)}/>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={e => this.sendMessage()}>Отправить</Button>
            </div>
        )
    }
}