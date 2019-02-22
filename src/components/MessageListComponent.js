import React, { Component } from 'react';
import socketCreator from '../sockerCreator'
import * as moment from 'moment';

const socket = socketCreator.create();

export default class MessageListComponent extends Component {
    state = {
        roomId:'',
        messages:[]
    };

    componentDidMount() {
        this.listenAddMessage();
        this.getUserNameFromLocalStorage();
    }

    componentDidUpdate(prevProps, prevState) {
        var messageBody = document.querySelector('#messages-list');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;


    }

    getUserNameFromLocalStorage(){
        this.setState({name: localStorage['userName']})
    }

    listenAddMessage(){
        socket.on('message', (message) => {
            this.setState(prevState => ({messages: [...prevState.messages, message]}));
        });
    }

    toTimeString(timeMilliseconds){
        let time =  moment(timeMilliseconds).format('h:mm');
        return time;
    }

    componentWillUnmount(){
        socket.removeAllListeners('message');
    }
    render(){
        const {messages} = this.state;
        let index = 0;
        const listItems = messages.map((message) => {
            if (message.type === 'message') {
                return <div key={index++} className={'user-message'}>
                        <div className='msg-time'>{this.toTimeString(message.time)}</div>
                        <div className='msg-name'><b>{message.user.name}</b></div>
                        <div className='msg-text'>{message.msg}</div>
                    </div>
            }
            if (message.type === 'notice') {
                return <div key={index++} className='notification-message'>{`${message.user.name}  ${message.msg}`}</div>
            }
            return <div key={index++}>Some strange message, maybe ERROR</div>
        });
        return (
            <div id='messages-list'>{listItems}</div>
        );
    }
}