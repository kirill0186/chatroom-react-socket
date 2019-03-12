import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';

import ChatComponent from './components/CChatComponent';
import LoginComponent from './components/LoginComponent';


class App extends Component {
  render() {
    return (
        <Router>
            <div>
                <div id='app'>
                    <h2>Chat Room</h2>
                    <Switch>
                        <Route path='/chat' component={ChatComponent} />
                        <Route path='/' component={LoginComponent} />
                    </Switch>
                </div>
            </div>
        </Router>
    );
  }
}

export default App;
