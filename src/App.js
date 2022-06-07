import './App.css';
import BattleShip from './BattleShip.js';

function App() {
  return (
    <div className="App">
	
      <header className="App-header">
        <h1> Battleship Dean </h1>
		<p> Click a square to fire on a ship</p>
      </header>
	  
	  <BattleShip rows="10" columns="10" maxshots="35" />
	  
    </div>
  );
}

export default App;
