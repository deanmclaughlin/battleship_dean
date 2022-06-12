import React from 'react';
import ReactDOM from 'react-dom/client';
import './BattleShip.css';
import BattleShip from './BattleShip';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
	
    <div className="App">
	
      <header className="App-header">
        <h1> Battleship Armada </h1>
		<p> Click a square to fire on a ship</p>
      </header>
	  
	  <main>
	    <BattleShip rows="10" columns="10" ships="20" shots="35" />
	  </main>
	  
    </div>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
