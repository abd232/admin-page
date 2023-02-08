import logo from './logo.svg';
import './App.css';
import Header from "./component/Header/Header"
import Menu from "./component/Menu/Menu"
import React from 'react';
import { ReactDOM } from 'react';
function App() {
  return (
    <div className="App">
      <Header/>
      <Menu/>
    </div>
  );
}

export default App;
