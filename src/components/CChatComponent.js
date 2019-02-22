import React, { Component } from 'react';
import socketCreator from '../sockerCreator'
import Button from '@material-ui/core/Button';

import MessageListComponent from './MessageListComponent';
import InputMessageComponent from './InputMessageComponent';
import UsersOnlineComponent from './UsersOnlineComponent';

const socket = socketCreator.create();


export default class ChatComponent extends Component {
    state = {
        user: '-',
        roomId: '',
        usersOnline: []
    };


    componentWillMount(){
        socket.on('join', ({room, user}) =>{
            console.log("join" + JSON.stringify(room));
            console.log("USER: "+JSON.stringify(user));
            this.setState({user: user, roomId: room.id, usersOnline: room.usersOnline});
            this.saveUserToLocalStore();
            this.saveRoomIdToLocalStore();
        });

        socket.on('update users online list', ({usersOnline}) => {
            console.log("upd online");
            this.setState({usersOnline: usersOnline});
        });

        socket.on('connect', () =>{
            console.log("CONNECT");
            console.log("LOCALSTORAGE" + typeof localStorage["user"]);
            if(localStorage["user"] !== undefined && localStorage["roomId"] !== undefined){
                socket.emit('join', {roomId: localStorage["roomId"], user: JSON.parse(localStorage["user"])}, (roomExist) => {
                    console.log("clb");
                    if(!roomExist){
                        console.log("ERROR: Room not exist");
                        this.routeChange();

                    }
                });
            }else {
                this.routeChange();
            }
        })
    }

    saveUserToLocalStore(){
        localStorage["user"] = JSON.stringify(this.state.user);
    };

    saveRoomIdToLocalStore(){
        localStorage["roomId"] = this.state.roomId;
    };

    componentWillUnmount(){
        socket.emit('leave');
        socket.removeAllListeners('join');
        socket.removeAllListeners('update users online list');
    }


    routeChange(){
        let path = `/`;
        this.props.history.push(path);
    }

    clickLeaveChat(){
        this.routeChange();
        socket.emit('leave');
    }

    render() {

        const {user, roomId, usersOnline} = this.state;
        return (
            <div id='chat-room-block'>
                <div id='chat-messages-block' className='card'>
                    <MessageListComponent />
                    <InputMessageComponent user={user} roomId={roomId}/>
                </div>
                <div id='chat-info-block'>
                    <div  className='card'>
                        <p>ID Комнаты: <span>{roomId}</span></p>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={e => {this.clickLeaveChat(e)}}>Покинуть комнату</Button>
                    </div>
                    <UsersOnlineComponent usersOnline={usersOnline}/>
                </div>
            </div>
        )
    }
}