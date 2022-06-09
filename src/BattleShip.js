import './App.css';
import './BattleShip.css';
import React from 'react';

class BattleShip extends React.Component {
    constructor(props) {
        super(props);
		/*   [ for future use... ]
		const nrows = Math.max(1, Math.min(Math.round(Number(this.props.rows)), 26));
		const ncols = Math.max(1, Math.min(Math.round(Number(this.props.columns)), 26));
		*/
		const nrows = 10;
		const ncols = 10;
		this.maxshots = Math.round(Number(this.props.maxshots));
		
		this.rowLabels = this.numArray(nrows);
        this.columnLabels = this.charArray( Math.max(1, Math.min(Number(ncols), 26)) );
		this.cellNames = this.coordsArray(this.rowLabels, this.columnLabels);
		this.occupiedCells = this.placeShips(this.cellNames, ncols, nrows);
						 
		this.initCells = {};
		for (let i=0; i<this.cellNames.length; i++) {
		    const occupado = this.occupiedCells.includes(this.cellNames[i]);
			const object = {address: this.cellNames[i], fill: "clear", occupied: occupado,
			                missed: false, hit: false};
			this.initCells = {...this.initCells, [this.cellNames[i]]: object};
		}
		
        this.state = {
			showTargets: false,
			shotsAllowed: this.maxshots,
			totalTargets: this.occupiedCells.length,
			totalFired: 0,
			totalHits: 0,
			totalMisses: 0,
			cells: {...this.initCells}
        };

	    this.fire = this.fire.bind(this);
	    this.clear = this.clear.bind(this);
		this.reveal = this.reveal.bind(this);
    }
	
    numArray(numElements) {
		let outputArray = [];
		for (let i=1; i<=numElements; i++) {
			outputArray.push(String(i));
		}
		return outputArray;
	}
	
	charArray(numElements) {
		const characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let outputArray = [];
		for (let i=1; i<=numElements; i++) {
			outputArray.push(characters.substring(i-1,i));
		}
		return outputArray;
	}
	
	coordsArray(rowNames, colNames) {
		let outputArray = [];
		for (let i=0; i<rowNames.length; i++) {
            let theRow = rowNames[i];
			for (let j=0; j<colNames.length; j++) {
				let theCol = colNames[j];
				outputArray.push(theCol+theRow);
			}
		}
		return outputArray;
	}
	
	placeShips(gridCells, numCol, numRow) {
		let outputArray = [];
	    outputArray = ["A1", "A2", "A3", "A4", "A5",
                       "G6", "H6", "I6",
		               "C7", "D8", "E9", "F10",
		    		   "G4", "H3", "I2", "J1",
					   "C2", "D3",
					   "I9", "J9"];
		return outputArray;
	}
	
	fire(event) {
		let theCell = event.target.id;
		
		if (this.state.showTargets
		       || this.state.cells[theCell].hit
			       || this.state.cells[theCell].missed) {
			return false;
		}
		
		let stateCells = {...this.state.cells};
     	let goodShot = this.state.cells[theCell].occupied;
	    if (goodShot) {		
	    	const newObject = {address: theCell, fill: "hit", occupied: stateCells[theCell].occupied,
			                   missed: false, hit: true};
		    delete stateCells[theCell];
			this.setState((state) => {
				return {totalFired: this.state.totalFired+1,
				        totalHits: this.state.totalHits+1,
				        cells: {...stateCells, [theCell]: newObject}};
			});
		} else {
	    	const newObject = {address: theCell, fill: "missed", occupied: stateCells[theCell].occupied,
			                   missed: true, hit: false};
		    delete stateCells[theCell];
			this.setState((state) => {
				return {totalFired: this.state.totalFired+1,
				        totalMisses: this.state.totalMisses+1,
					    cells: {...stateCells, [theCell]: newObject}};
			});
		}
	}
	
	reveal(event) {
		let stateCells = {...this.state.cells};
		const theButton = event.target;
		
		if (!this.state.showTargets) {
			theButton.classList.remove("click-to-show");
			theButton.classList.add("click-to-hide");
			for (let theCell of this.cellNames) {
				let theFill = "clear";
				if (stateCells[theCell].occupied) {
					theFill = "show";
				}
	    	    const newObject = {address: theCell, fill: theFill, occupied: stateCells[theCell].occupied,
				                   missed: stateCells[theCell].missed, hit: stateCells[theCell].hit};
				delete stateCells[theCell];
                this.setState((state) => {
					return {showTargets: true, cells: {...state.cells, [theCell]: newObject}};
				});
			}
		} else if (this.state.showTargets) {
			theButton.classList.remove("click-to-hide");
			theButton.classList.add("click-to-show");
			for (let theCell of this.cellNames) {
				let theFill = "clear";
				if (stateCells[theCell].hit) {
					theFill = "hit";
				} else if (stateCells[theCell].missed) {
					theFill = "missed";
				}
	    	    const newObject = {address: theCell, fill: theFill, occupied: stateCells[theCell].occupied,
				                   missed: stateCells[theCell].missed, hit: stateCells[theCell].hit};
				delete stateCells[theCell];
                this.setState((state) => {
					return {showTargets: false, cells: {...state.cells, [theCell]: newObject}};
				});
			}			
		}
	}
	
	clear() {
	    /* alert("RESET"); */
        this.setState((state) => {
			return {
			    showTargets: false,
			    shotsAllowed: this.maxshots,
			    totalTargets: this.occupiedCells.length,
	            totalFired: 0,
	            totalHits: 0,
	            totalMisses: 0,
	            cells: {...this.initCells}
			};
        });
		const theButton = document.getElementById("show-hide-button");
		if (theButton.classList.contains("click-to-hide")) {
			theButton.classList.remove("click-to-hide");
			theButton.classList.add("click-to-show");			
		}
	}
	
	componentDidUpdate() {
		/*
		  let obj = this.initCells["C3"];
          alert("INIT: " + obj.address + "   " + obj.fill + "   " + obj.occupied + "   " + obj.hit);
		  obj = this.state.cells["C3"];
          alert("NOW: " + obj.address + "   " + obj.fill + "   " + obj.occupied + "   " + obj.hit);
		
		  let cc=0;
		  for (let property in this.state.cells) {
			  cc = cc+1;
		  }
		  alert(cc);
		*/
		
		if (this.state.totalHits === this.state.totalTargets) {
			let message = "YOU WIN! " + (this.state.totalTargets) 
                			+ " targets hit with " + this.state.totalFired + " shots.";
			alert(message + "\n\nClick OK to start a new game.");
			this.clear();
		} else if (this.state.totalFired === this.state.shotsAllowed) {
			let message = "YOU LOSE! " + (this.state.totalTargets - this.state.totalHits)
			                + " targets have survived your attack.";
			alert(message + "\n\nClick OK to start a new game.");
			this.clear();
		}
				
	}
	
    render() {
        return (
		    <div className={"game-holder"}>

                <div className={"game-flex"}>
				    <div id="the-board">
		            <table className={"game-board"}>
			
			            <thead>
			            <tr>
				            <th></th>
					        {this.columnLabels.map(col => <th key={"col"+col} id={"col"+col}>{col}</th>)}
			            </tr>
			            </thead>
						
                        <tbody>
			            {this.rowLabels.map(row => 
			            <tr key={"row"+row} id={"row"+row}>
				            <td>{row}</td>
				            {this.columnLabels.map(col =>
							    <td key={col+row} id={col+row} className={this.state.cells[col+row].fill} onClick={this.fire}> </td>)}
				        </tr>
			            )}
                        </tbody>
						
                    </table>
			        </div>
				   
			        <div id="score-status">
			        <p> HITS:&nbsp; {this.state.totalHits} </p>
			        <p> MISSES:&nbsp; {this.state.totalMisses} </p>
					<p> SHOTS<br/>REMAINING:&nbsp; {this.state.shotsAllowed - this.state.totalFired}</p>
					<p> TARGETS<br/>REMAINING:&nbsp; {this.state.totalTargets - this.state.totalHits} </p>
					
					<br/>
                    <button id="show-hide-button" className={"click-to-show"} onClick={this.reveal}></button>
					<br/><br/>
			        <button id="new-game-button" className={"bottom-row"} onClick={this.clear}>RESET GAME</button>	
                    </div>
				</div>
			</div>
        );
    }

}
export default BattleShip;