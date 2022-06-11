import './App.css';
import './BattleShip.css';
import React from 'react';

class BattleShip extends React.Component {
    constructor(props) {
        super(props);
		/*   [ for future use... ]
		this.nrows = Math.max(8, Math.min(Math.round(Number(this.props.rows)), 26));
		this.ncols = Math.max(8, Math.min(Math.round(Number(this.props.columns)), 26));
		*/
		this.nrows = 10;
		this.ncols = 10;
		this.ntargs = 5 * Math.round((this.nrows * this.ncols)/25);
		this.maxshots = 2 * this.ntargs;
		
		this.rowLabels = this.numArray(this.nrows);
        this.columnLabels = this.charArray(this.ncols);
		this.cellNames = this.coordsArray(this.rowLabels, this.columnLabels);
		
		this.occupiedCells = this.populate(this.ntargs, this.cellNames, this.columnLabels, this.rowLabels);
		
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
			totalTargets: this.ntargs,
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
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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
	
	populate(numTarget, gridCells, columnNames, rowNames) {
	    let available = [...gridCells];
		let outputArray = [];
		
		/*
		const allSizes = [ [6,4,3,3,2,2], [5,4,4,3,2,2],
		                   [5,4,3,3,3,2], [4,4,4,3,3,2] ];
		const allOrientations = ["horizontal", "vertical", "diagonal"];
		const sizes = allSizes[ Math.floor(Math.random() * allSizes.length) ];
		let orientations = [];
		for (let i=1; i<=sizes.length; i++) {
			const thisOrientation =  allOrientations[ Math.floor(Math.random() * allOrientations.length) ];
			orientations.push(thisOrientation);
		}
		
		alert(sizes + "   " + orientations);
		*/
	    
		/*
		outputArray = ["A1", "A2", "A3", "A4", "A5",
                       "G6", "H6", "I6",
		               "C7", "D8", "E9", "F10",
		    		   "G4", "H3", "I2", "J1",
					   "C2", "D3",
					   "I9", "J9"];
		*/
		
        for (let i=1; i<=numTarget; i++) {
			const cellToAdd = Math.floor(Math.random() * available.length);
			outputArray.push(available[cellToAdd]);
			available.splice(cellToAdd, 1);
		}
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
		this.occupiedCells = this.populate(this.ntargs, this.cellNames, this.columnLabels, this.rowLabels);
		
		this.initCells = {};
		for (let i=0; i<this.cellNames.length; i++) {
		    const occupado = this.occupiedCells.includes(this.cellNames[i]);
			const object = {address: this.cellNames[i], fill: "clear", occupied: occupado,
			                missed: false, hit: false};
			this.initCells = {...this.initCells, [this.cellNames[i]]: object};
		}
		
        this.setState((state) => {
			return {
			    showTargets: false,
			    shotsAllowed: this.maxshots,
			    totalTargets: this.ntargs,
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