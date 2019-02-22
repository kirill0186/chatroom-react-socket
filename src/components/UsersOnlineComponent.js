import React, { Component } from 'react';

export default class UsersOnlineComponent extends Component {
    state = {
        usersOnline: []
    };

    componentDidUpdate(prevProps) {
        if (this.props.usersOnline !== prevProps.usersOnline) {
            this.setState({usersOnline: this.props.usersOnline});
        }
    }

    render(){
        const {usersOnline} = this.state;
        let index = 0;
        const listItems = usersOnline.map((user) =>
            <div key={index++}>{user.name}</div>
        );
        return (
            <div id='users-online-block'  className='card'>
                <p><b>Пользователи онлайн</b></p>
                {listItems}
                </div>
        );
    }

}