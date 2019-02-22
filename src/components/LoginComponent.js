import React, { Component } from 'react';
import socketCreator from '../sockerCreator';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


const socket = socketCreator.create();

export default class LoginComponent extends Component {
    state = {
        userName: '',
        userId: '',
        roomId: ''
    };


    routeChange(){
        let path = `/chat`;
        this.props.history.push(path);
    }



    componentWillMount() {
        this.getLastUserNameFromLocalStorage();
    };

    getLastUserNameFromLocalStorage = () => {
        if (localStorage["user"] !== undefined) {
            let user = ["user"];
            console.log(JSON.stringify(user));
            this.setState({userName: user.name, userId: user.id});
        }
    };

    handleChangeInput(e, stateName) {
        this.setState({
            [stateName]: e.target.value
        });
        if(stateName === 'userName' && e.target.value.length < 4){
            document.getElementById('input-name-exception').style.visibility = 'visible';
        }else document.getElementById('input-name-exception').style.visibility = 'hidden';

        if(stateName === 'roomId' && e.target.value.length !== 36){
            document.getElementById('room-id-exception').innerText = 'Неверный ID комнаты';
            document.getElementById('room-id-exception').style.visibility = 'visible';
        }else document.getElementById('room-id-exception').style.visibility = 'hidden';
    };

    createNewChatRoom(user) {
        console.log('USERRRRR'+ typeof user);
        console.log('USERRRRR ID'+ user.id);
        socket.emit('create room', user);
        this.routeChange();

    };

    joinRoom(roomId, user){
        console.log("USEER" + user);
        socket.emit('join', {roomId: roomId, user: user}, (roomExist) => {
            console.log("clb");
            if(roomExist){
                this.routeChange();
            }else {
                document.getElementById('room-id-exception').innerText = 'Такой комнаты не существует';
                document.getElementById('room-id-exception').style.visibility = 'visible';
            }
        });
    }

    clickCreateChat(e, user){
        if(user.name !== undefined) {
            if (user.name.length >= 4) {
                this.createNewChatRoom(user);
            }
        }
    }

    clickJoinChat(e, user, roomId){
        if(user.name !== undefined && roomId !== undefined){
            if(user.name.length >= 4 && roomId.length === 36) {
                this.joinRoom(roomId, user);
            }
        }
    }

    render() {
        const {userName, userId, roomId} = this.state;
        return (
            <div id='login-block' className='card'>
                <TextField
                        variant="outlined"
                        label="Имя пользователя"
                        id="user-name-input"
                        value={userName}
                        onChange={e => this.handleChangeInput(e, "userName")}
                />
                <p  id='input-name-exception'>Слишком короткое имя. Не меньше 4 символов</p>
                <Button onClick={e => {this.clickCreateChat(e, {name: userName, id: userId})}}>Создать новый чат</Button>

                <br/>
                <TextField
                        id="room-id-input"
                        variant="outlined"
                        label="ID Чата"
                        onChange={e => this.handleChangeInput(e, "roomId")}
                />
                <p  id='room-id-exception'>Неверный ID комнаты</p>
                <Button onClick={e => {this.clickJoinChat(e, {name: userName, id: userId}, roomId)}}>Присоединиться к чату</Button>
            </div>
        )
    }
}