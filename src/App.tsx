import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import GameBoard from './components/GameBoard';

const App: React.FunctionComponent = (): JSX.Element => {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/" exact>
          <h1>Connect Four</h1>
          <GameBoard />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;